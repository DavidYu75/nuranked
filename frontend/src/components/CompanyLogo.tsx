"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getCompanyLogoUrl } from "../utils/imageUtils";

interface CompanyLogoProps {
  company: string;
  size?: number;
  className?: string;
}

// In-memory cache for logo URLs to avoid redundant function calls
const logoUrlCache = new Map<string, string>();

/**
 * CompanyLogo component that uses Next.js Image for optimized loading and caching.
 * Includes an in-memory cache to avoid regenerating URLs for the same company.
 */
export default function CompanyLogo({
  company,
  size = 40,
  className = "",
}: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>(
    "/images/company-placeholder.svg",
  );

  useEffect(() => {
    if (!company) {
      setLogoUrl("/images/company-placeholder.svg");
      return;
    }

    // Check cache first
    const cacheKey = company.toLowerCase().trim();
    if (logoUrlCache.has(cacheKey)) {
      setLogoUrl(logoUrlCache.get(cacheKey)!);
      return;
    }

    // Generate URL and cache it
    const url = getCompanyLogoUrl(company);
    logoUrlCache.set(cacheKey, url);
    setLogoUrl(url);
  }, [company]);

  if (!company || imageError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/company-placeholder.svg"
          alt="Company placeholder"
          width={size}
          height={size}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={`${company} logo`}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      onError={() => setImageError(true)}
      unoptimized={false}
    />
  );
}
