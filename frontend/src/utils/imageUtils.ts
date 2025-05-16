/**
 * Utility functions for image handling in the NeuRanked application
 */

/**
 * Generates a company logo URL from a company name using Clearbit's Logo API
 * 
 * @param companyName - The name of the company
 * @returns The URL to the company's logo from Clearbit
 */
export function getCompanyLogoUrl(companyName: string): string {
  if (!companyName) {
    return '/images/company-placeholder.svg';
  }
  
  // Convert to lowercase and trim whitespace
  const normalizedName = companyName.toLowerCase().trim();
  
  // Remove common suffixes and spaces to get a clean domain name
  const simplifiedName = normalizedName
    .replace(/(inc\.?|corp\.?|llc\.?|ltd\.?)$/i, '')
    .trim()
    .replace(/\s+/g, '');
  
  // Return the Clearbit logo URL
  return `https://logo.clearbit.com/${simplifiedName}.com`;
}
