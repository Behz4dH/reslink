import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export interface BadgeOptions {
  uniqueId: string;
  baseUrl?: string;
  position?: {
    x?: number;
    y?: number;
  };
  size?: {
    width?: number;
    height?: number;
  };
}

export class PDFBadgeService {
  private static readonly DEFAULT_BADGE_WIDTH = 100;
  private static readonly DEFAULT_BADGE_HEIGHT = 30;
  private static readonly DEFAULT_BASE_URL = 'https://reslink.app';

  /**
   * Add a Reslink badge to a PDF file
   */
  static async addBadgeToPDF(
    pdfBuffer: Buffer,
    options: BadgeOptions
  ): Promise<Buffer> {
    try {
      console.log('🔍 Starting PDF badge creation...');
      console.log('PDF buffer size:', pdfBuffer.length);
      console.log('Options:', options);
      
      // Load the existing PDF
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      console.log('✅ PDF loaded successfully');
      
      // Get the first page (where we'll add the badge)
      const firstPage = pdfDoc.getPages()[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();
      
      // Calculate badge position (default: top-right corner with margin)
      const badgeWidth = options.size?.width || this.DEFAULT_BADGE_WIDTH;
      const badgeHeight = options.size?.height || this.DEFAULT_BADGE_HEIGHT;
      const margin = 10;
      
      const badgeX = options.position?.x ?? (pageWidth - badgeWidth - margin);
      const badgeY = options.position?.y ?? (pageHeight - badgeHeight - margin);
      
      // Create the badge URL
      const badgeUrl = `${options.baseUrl || this.DEFAULT_BASE_URL}/view/${options.uniqueId}`;
      
      // Add the badge to the PDF
      await this.drawBadge(firstPage, badgeX, badgeY, badgeWidth, badgeHeight, badgeUrl);
      
      // Save and return the modified PDF
      const pdfBytes = await pdfDoc.save();
      return Buffer.from(pdfBytes);
      
    } catch (error) {
      console.error('Error adding badge to PDF:', error);
      throw new Error(`Failed to add badge to PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Draw the badge on the PDF page
   */
  private static async drawBadge(
    page: PDFPage,
    x: number,
    y: number,
    width: number,
    height: number,
    url: string
  ): Promise<void> {
    try {
      // Get font
      const font = await page.doc.embedFont(StandardFonts.Helvetica);
      const boldFont = await page.doc.embedFont(StandardFonts.HelveticaBold);
      
      // Badge colors (matching the design from reslink-badge.png)
      const badgeColor = rgb(0.2, 0.4, 0.9); // Blue color
      const textColor = rgb(1, 1, 1); // White text
      const borderRadius = 6;
      
      // Draw the badge background with rounded corners simulation
      // Main rectangle (slightly smaller to create rounded effect)
      page.drawRectangle({
        x: x + borderRadius/2,
        y: y,
        width: width - borderRadius,
        height: height,
        color: badgeColor,
      });
      
      // Left rounded edge
      page.drawRectangle({
        x: x,
        y: y + borderRadius/2,
        width: borderRadius/2,
        height: height - borderRadius,
        color: badgeColor,
      });
      
      // Right rounded edge  
      page.drawRectangle({
        x: x + width - borderRadius/2,
        y: y + borderRadius/2,
        width: borderRadius/2,
        height: height - borderRadius,
        color: badgeColor,
      });
      
      // Add corner circles to simulate rounded corners
      page.drawCircle({
        x: x + borderRadius/2,
        y: y + borderRadius/2,
        size: borderRadius/2,
        color: badgeColor,
      });
      
      page.drawCircle({
        x: x + width - borderRadius/2,
        y: y + borderRadius/2,
        size: borderRadius/2,
        color: badgeColor,
      });
      
      page.drawCircle({
        x: x + borderRadius/2,
        y: y + height - borderRadius/2,
        size: borderRadius/2,
        color: badgeColor,
      });
      
      page.drawCircle({
        x: x + width - borderRadius/2,
        y: y + height - borderRadius/2,
        size: borderRadius/2,
        color: badgeColor,
      });
      
      // Calculate text positioning with link symbol  
      const linkSymbol = '🔗'; // Link emoji
      const badgeText = ' View Reslink';
      const fullText = linkSymbol + badgeText;
      const fontSize = Math.min(10, height * 0.4); // Responsive font size
      
      // Try with emoji, fallback to plain text if it fails
      let textWidth;
      let displayText;
      try {
        textWidth = boldFont.widthOfTextAtSize(fullText, fontSize);
        displayText = fullText;
      } catch (encodingError) {
        // Fallback to text without emoji
        displayText = 'View Reslink';
        textWidth = boldFont.widthOfTextAtSize(displayText, fontSize);
      }
      
      const textX = x + (width - textWidth) / 2; // Center horizontally
      const textY = y + (height / 2) - (fontSize / 2); // Center vertically
      
      // Draw the text
      page.drawText(displayText, {
        x: textX,
        y: textY,
        size: fontSize,
        font: boldFont,
        color: textColor,
      });
      
      // Create a clickable link annotation using proper PDF-lib API
      try {
        const linkAnnot = page.doc.context.register(
          page.doc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            Rect: [x, y, x + width, y + height],
            Border: [0, 0, 0], // No border
            A: {
              Type: 'Action',
              S: 'URI',
              URI: url,
            },
          })
        );

        // Add annotation to page using the node's addAnnot method
        page.node.addAnnot(linkAnnot);
      } catch (linkError) {
        console.warn('Could not create clickable link, adding URL as text instead:', linkError);
        // Fallback: add URL as text below badge
        page.drawText(url, {
          x: x,
          y: y - 20,
          size: 7,
          font: font,
          color: rgb(0.4, 0.4, 0.4),
        });
      }
      
    } catch (error) {
      console.error('Error drawing badge:', error);
      throw error;
    }
  }

  /**
   * Process a PDF file and add a badge
   */
  static async processPDFFile(
    inputPath: string,
    outputPath: string,
    options: BadgeOptions
  ): Promise<void> {
    try {
      // Read the input PDF
      const pdfBuffer = await fs.readFile(inputPath);
      
      // Add the badge
      const modifiedPdfBuffer = await this.addBadgeToPDF(pdfBuffer, options);
      
      // Write the output PDF
      await fs.writeFile(outputPath, modifiedPdfBuffer);
      
    } catch (error) {
      console.error('Error processing PDF file:', error);
      throw error;
    }
  }

  /**
   * Generate a badge for a reslink and return as buffer
   */
  static async generateBadgedPDF(
    originalPdfBuffer: Buffer,
    uniqueId: string,
    baseUrl?: string
  ): Promise<Buffer> {
    return this.addBadgeToPDF(originalPdfBuffer, {
      uniqueId,
      baseUrl,
    });
  }

  /**
   * Validate PDF file
   */
  static async validatePDF(buffer: Buffer): Promise<boolean> {
    try {
      await PDFDocument.load(buffer);
      return true;
    } catch (error) {
      console.error('PDF validation failed:', error);
      return false;
    }
  }
}

export default PDFBadgeService;