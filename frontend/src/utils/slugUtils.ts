/**
 * Utility functions for generating and parsing reslink slugs
 * Format: position-company (e.g., "software-engineer-meta")
 */

export const createSlug = (position: string, company: string): string => {
  const cleanText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const cleanPosition = cleanText(position);
  const cleanCompany = cleanText(company);
  
  return `${cleanPosition}-${cleanCompany}`;
};

export const parseSlug = (slug: string): { position: string; company: string } | null => {
  if (!slug || typeof slug !== 'string') {
    return null;
  }

  // Find the last hyphen to split position from company
  const lastHyphenIndex = slug.lastIndexOf('-');
  
  if (lastHyphenIndex === -1) {
    return null;
  }

  const positionPart = slug.substring(0, lastHyphenIndex);
  const companyPart = slug.substring(lastHyphenIndex + 1);

  if (!positionPart || !companyPart) {
    return null;
  }

  // Convert back to readable format
  const position = positionPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const company = companyPart
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return { position, company };
};

export const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') {
    return false;
  }

  // Check if slug has at least one hyphen and valid characters
  return /^[a-z0-9]+(-[a-z0-9]+)+$/.test(slug);
};

// Generate slug from reslink object
export const getReslinkSlug = (reslink: { position: string; company: string }): string => {
  return createSlug(reslink.position, reslink.company);
};

// Generate public URL for reslink
export const getReslinkPublicUrl = (reslink: { position: string; company: string }): string => {
  const slug = getReslinkSlug(reslink);
  return `/reslink/${slug}`;
};

// Examples:
// createSlug("Software Engineer", "Meta") → "software-engineer-meta"
// createSlug("Product Manager", "Google") → "product-manager-google" 
// parseSlug("software-engineer-meta") → { position: "Software Engineer", company: "Meta" }
// getReslinkPublicUrl({ position: "Software Engineer", company: "Meta" }) → "/reslink/software-engineer-meta"