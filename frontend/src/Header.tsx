import React, { useEffect, useState } from "react";
import Link from "next/link";
import { isAuthenticated, logoutUser, getCurrentUser } from "./services/auth";

export default function Header({ showMiniLogo }: { showMiniLogo?: boolean }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  // Check authentication status when component mounts
  useEffect(() => {
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    
    if (authStatus) {
      const user = getCurrentUser();
      if (user) {
        setUsername(user.name);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    setUsername('');
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <header className="w-full flex items-center justify-between px-6 border-b-1 border-black bg-white sticky top-0 z-50 transition-shadow" style={{ height: 64 }}>
      <div className="flex-1 flex items-center">
        <Link href="/#about" className="text-base text-black font-medium">About</Link>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {showMiniLogo && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-black font-docallisme">NU</span>
            <span className="text-2xl font-bold text-black font-docallisme">RANKED</span>
            <span className="text-sm text-red-800 font-mono ml-2">F25</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center justify-end">
        {authenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-base text-black font-medium">{username}</span>
            <button 
              onClick={handleLogout}
              className="text-base text-black font-medium hover:text-gray-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/auth" className="text-base text-black font-medium hover:text-gray-600">
            Sign Up / Sign In
          </Link>
        )}
      </div>
    </header>
  );
} 