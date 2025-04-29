import React from "react";
import dynamic from 'next/dynamic';
const SplineIcon = dynamic(() => import('./SplineIcon'), { ssr: false });

export default function Header({ showMiniLogo }: { showMiniLogo?: boolean }) {
  return (
    <header className="w-full flex items-center justify-between px-6 border-b-1 border-black bg-white sticky top-0 z-50 transition-shadow" style={{ height: 64 }}>
      <div className="flex-1 flex items-center">
        <a href="#about" className="text-base text-black font-medium">About</a>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {showMiniLogo && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-black font-docallisme">NU</span>
            <SplineIcon className="w-6 h-6" style={{ minWidth: 24, minHeight: 24 }} />
            <span className="text-2xl font-bold text-black font-docallisme">RANKED</span>
            <span className="text-sm text-red-800 font-mono ml-2">F25</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center justify-end">
        <a href="#signup/signin" className="text-base text-black font-medium">Sign Up / Sign In</a>
      </div>
    </header>
  );
} 