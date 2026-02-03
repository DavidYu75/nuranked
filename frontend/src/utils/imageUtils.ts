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
// Known university domain mappings for common edge cases
const universityDomainMap: Record<string, string> = {
  mit: "mit.edu",
  ucla: "ucla.edu",
  usc: "usc.edu",
  nyu: "nyu.edu",
  bu: "bu.edu",
  "boston university": "bu.edu",
  "northeastern university": "northeastern.edu",
  northeastern: "northeastern.edu",
  harvard: "harvard.edu",
  "harvard university": "harvard.edu",
  stanford: "stanford.edu",
  "stanford university": "stanford.edu",
  yale: "yale.edu",
  "yale university": "yale.edu",
  princeton: "princeton.edu",
  "princeton university": "princeton.edu",
  columbia: "columbia.edu",
  "columbia university": "columbia.edu",
  berkeley: "berkeley.edu",
  "uc berkeley": "berkeley.edu",
  "carnegie mellon": "cmu.edu",
  "carnegie mellon university": "cmu.edu",
  cmu: "cmu.edu",
  "georgia tech": "gatech.edu",
  "georgia institute of technology": "gatech.edu",
  "university of michigan": "umich.edu",
  "university of texas": "utexas.edu",
  "ut austin": "utexas.edu",
  "university of washington": "uw.edu",
  "university of pennsylvania": "upenn.edu",
  upenn: "upenn.edu",
  penn: "upenn.edu",
  cornell: "cornell.edu",
  "cornell university": "cornell.edu",
  "brown university": "brown.edu",
  brown: "brown.edu",
  dartmouth: "dartmouth.edu",
  "dartmouth college": "dartmouth.edu",
  "duke university": "duke.edu",
  duke: "duke.edu",
  "university of chicago": "uchicago.edu",
  uchicago: "uchicago.edu",
  "johns hopkins": "jhu.edu",
  "johns hopkins university": "jhu.edu",
  jhu: "jhu.edu",
  "northwestern university": "northwestern.edu",
  northwestern: "northwestern.edu",
  "purdue university": "purdue.edu",
  purdue: "purdue.edu",
  "university of illinois": "illinois.edu",
  uiuc: "illinois.edu",
  "ohio state": "osu.edu",
  "ohio state university": "osu.edu",
  "penn state": "psu.edu",
  "pennsylvania state university": "psu.edu",
  "university of florida": "ufl.edu",
  "texas a&m": "tamu.edu",
  "texas a&m university": "tamu.edu",
  "virginia tech": "vt.edu",
  "university of virginia": "virginia.edu",
  uva: "virginia.edu",
  "rice university": "rice.edu",
  rice: "rice.edu",
  "vanderbilt university": "vanderbilt.edu",
  vanderbilt: "vanderbilt.edu",
  "emory university": "emory.edu",
  emory: "emory.edu",
  "notre dame": "nd.edu",
  "university of notre dame": "nd.edu",
  "wake forest": "wfu.edu",
  "tufts university": "tufts.edu",
  tufts: "tufts.edu",
  "boston college": "bc.edu",
  bc: "bc.edu",
};

// Educational institution keywords that indicate .edu domain
const educationalKeywords = [
  "university",
  "college",
  "institute of technology",
  "school of",
  "academy",
];

/**
 * Check if a name represents an educational institution
 */
function isEducationalInstitution(name: string): boolean {
  const lowerName = name.toLowerCase();
  return educationalKeywords.some((keyword) => lowerName.includes(keyword));
}

/**
 * Extract the primary name for educational institutions
 * e.g., "Northeastern University" -> "northeastern"
 */
function extractEducationalDomain(name: string): string {
  let cleaned = name.toLowerCase().trim();

  // Remove common suffixes
  cleaned = cleaned
    .replace(/\s*(university|college|institute of technology|academy)\s*/gi, "")
    .replace(/\s*(of|the)\s*/gi, " ")
    .trim()
    .replace(/\s+/g, "");

  return cleaned + ".edu";
}

export function getCompanyLogoUrl(companyName: string): string {
  if (!companyName) {
    return "/images/company-placeholder.svg";
  }

  const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
  const normalizedName = companyName.toLowerCase().trim();

  let domain: string;

  // Check for known university mappings first
  if (universityDomainMap[normalizedName]) {
    domain = universityDomainMap[normalizedName];
  } else if (isEducationalInstitution(companyName)) {
    // For unrecognized educational institutions, try to extract a reasonable domain
    domain = extractEducationalDomain(companyName);
  } else {
    // Standard company domain generation
    domain =
      companyName
        .toLowerCase()
        .trim()
        .replace(/(inc\.?|corp\.?|llc\.?|ltd\.?)$/i, "")
        .trim()
        .replace(/\s+/g, "") + ".com";
  }

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
