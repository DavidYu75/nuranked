/**
 * Utility functions for image handling in the NeuRanked application
 */

/**
 * Generates a company logo URL from a company name using Logo.dev API
 * (High-quality replacement for the discontinued Clearbit Logo API)
 *
 * @param companyName - The name of the company
 * @returns The URL to the company's logo
 */
export function getCompanyLogoUrl(companyName: string): string {
  if (!companyName) {
    return "/images/company-placeholder.svg";
  }

  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;

  // Convert company name to a domain-like format
  const domain =
    companyName
      .toLowerCase()
      .trim()
      .replace(/(inc\.?|corp\.?|llc\.?|ltd\.?)$/i, "")
      .trim()
      .replace(/\s+/g, "") + ".com";

  // Fallback to Google favicon if no Logo.dev token is configured
  if (!token) {
    console.warn(
      "NEXT_PUBLIC_LOGO_DEV_TOKEN not set, falling back to Google favicon service",
    );
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  // Use Logo.dev API for high-quality logos
  return `https://img.logo.dev/${domain}?token=${token}`;
}
