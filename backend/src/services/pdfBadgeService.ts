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
  private static readonly DEFAULT_BADGE_WIDTH = 120;
  private static readonly DEFAULT_BADGE_HEIGHT = 35;
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
      const margin = 20;
      
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
      
      // Badge colors (matching the playbutton.png design)
      const badgeColor = rgb(0.24, 0.51, 0.91); // Bright blue color like in playbutton.png
      const textColor = rgb(1, 1, 1); // White text
      const borderRadius = 8; // More rounded corners like the design
      
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
      
      // Draw play icon (triangle) and text like in playbutton.png
      const badgeText = 'Play Intro';
      const fontSize = Math.min(11, height * 0.35); // Responsive font size
      const textWidth = boldFont.widthOfTextAtSize(badgeText, fontSize);
      
      // Calculate positions for play icon and text
      const playIconSize = height * 0.4; // Size of the play triangle
      const totalContentWidth = playIconSize + 6 + textWidth; // icon + gap + text
      const startX = x + (width - totalContentWidth) / 2; // Center the content
      
      // Draw play triangle (pointing right)
      const triangleX = startX;
      const triangleY = y + height / 2;
      const triangleHeight = playIconSize * 0.8;
      const triangleWidth = playIconSize * 0.7;
      
      // Draw the play triangle using three lines to form a triangle
      page.drawLine({
        start: { x: triangleX, y: triangleY - triangleHeight/2 },
        end: { x: triangleX + triangleWidth, y: triangleY },
        color: textColor,
        thickness: 2,
      });
      page.drawLine({
        start: { x: triangleX + triangleWidth, y: triangleY },
        end: { x: triangleX, y: triangleY + triangleHeight/2 },
        color: textColor,
        thickness: 2,
      });
      page.drawLine({
        start: { x: triangleX, y: triangleY + triangleHeight/2 },
        end: { x: triangleX, y: triangleY - triangleHeight/2 },
        color: textColor,
        thickness: 2,
      });
      
      // Fill the triangle by drawing smaller triangles
      for (let i = 0; i < triangleWidth; i += 1) {
        const ratio = i / triangleWidth;
        const lineHeight = triangleHeight * (1 - ratio);
        page.drawLine({
          start: { x: triangleX + i, y: triangleY - lineHeight/2 },
          end: { x: triangleX + i, y: triangleY + lineHeight/2 },
          color: textColor,
          thickness: 1,
        });
      }
      
      // Draw the text next to the play icon
      const textX = triangleX + triangleWidth + 6; // 6px gap from triangle
      const textY = y + (height / 2) - (fontSize / 2); // Center vertically
      
      page.drawText(badgeText, {
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