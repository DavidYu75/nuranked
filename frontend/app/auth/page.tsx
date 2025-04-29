"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import SignIn from '../../src/components/auth/SignIn';
import SignUp from '../../src/components/auth/SignUp';
import Header from '../../src/Header';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-4xl font-bold text-black font-docallisme">NU</span>
              <span className="text-4xl font-bold text-black font-docallisme">RANKED</span>
              <span className="text-sm text-red-800 font-mono ml-2">F25</span>
            </Link>
          </div>

          <div className="bg-white border border-black">
            <div className="flex border-b border-black">
              <button
                className={`flex-1 py-3 font-medium  ${!isSignUp ? 'bg-gray-100 text-black' : 'bg-white text-gray-500'}`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
              <button
                className={`flex-1 py-3 font-medium ${isSignUp ? 'bg-gray-100 text-black' : 'bg-white text-gray-500'}`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            <div className="p-6">
              {isSignUp ? <SignUp toggleForm={toggleForm} /> : <SignIn />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 