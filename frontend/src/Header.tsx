import React from "react";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b-1 border-black">
      <div>
        <a href="#about" className="text-base text-black font-medium">About</a>
      </div>
      <div>
        <a href="#signup/signin" className="text-base text-black font-medium">Sign Up / Sign In</a>
      </div>
    </header>
  );
} 