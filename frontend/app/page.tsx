"use client"
import Header from "../src/Header";
import React, { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { isAuthenticated, getCurrentUser } from "../src/services/auth";
const SplineIcon = dynamic(() => import('../src/SplineIcon'), { ssr: false });

// Helper to get ordinal suffix
function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Dummy data for leaderboard
const leaderboard = [
  {
    id: 1,
    name: "Alice Smith",
    year: 1,
    clubs: ["🏀", "💻", "🎨"],
    elo: 1520,
    img: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 2,
    name: "Bob Johnson",
    year: 2,
    clubs: ["🎵", "📚"],
    elo: 1480,
    img: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    id: 3,
    name: "Carol Lee",
    year: 3,
    clubs: ["🤖", "🏊"],
    elo: 1450,
    img: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    id: 4,
    name: "David Kim",
    year: 4,
    clubs: ["🎮", "🎸"],
    elo: 1430,
    img: "https://randomuser.me/api/portraits/men/4.jpg",
  },
  {
    id: 5,
    name: "Eva Green",
    year: 2,
    clubs: ["🎤", "🧩"],
    elo: 1410,
    img: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  {
    id: 6,
    name: "Frank Lee",
    year: 5,
    clubs: ["🧑‍🔬", "🏸"],
    elo: 1390,
    img: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: 7,
    name: "Grace Park",
    year: 1,
    clubs: ["🎭", "🧗"],
    elo: 1370,
    img: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: 8,
    name: "Henry Ford",
    year: 3,
    clubs: ["🚴", "🎬"],
    elo: 1350,
    img: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    id: 9,
    name: "Ivy Chen",
    year: 4,
    clubs: ["🎹", "🧘"],
    elo: 1330,
    img: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    id: 10,
    name: "Jack Black",
    year: 2,
    clubs: ["🏓", "🎲"],
    elo: 1310,
    img: "https://randomuser.me/api/portraits/men/10.jpg",
  },
];

export default function Home() {
  const [showMiniLogo, setShowMiniLogo] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    profile_id: string;
    name: string;
    is_northeastern_verified: boolean;
  } | null>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication status
    const authStatus = isAuthenticated();
    setAuthenticated(authStatus);
    
    if (authStatus) {
      const userData = getCurrentUser();
      setUser(userData);
    }

    // Handle logo visibility on scroll
    function onScroll() {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      setShowMiniLogo(rect.bottom <= 130); 
    }
    
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header showMiniLogo={showMiniLogo} />
      <div className="flex flex-1 items-center justify-center">
        <div ref={logoRef} className="relative flex items-center gap-6 left-4 select-none z-0">
          <span className="text-6xl font-bold text-black font-docallisme">NU</span>
          <SplineIcon className="w-23 h-55" style={{ minWidth: 40, minHeight: 40 }} />
          <span className="text-6xl font-bold text-black font-docallisme">RANKED</span>
        </div>
      </div>
      
      {authenticated && user && (
        <div className="w-full flex justify-center">
          <div className="max-w-2xl w-full bg-gray-50 border border-black p-4 mb-4">
            <h2 className="font-medium text-lg">Welcome back, {user.name}!</h2>
            <p className="text-sm mt-2">
              {user.is_northeastern_verified 
                ? "Your Northeastern email has been verified." 
                : "Please verify your Northeastern email to unlock all features."}
            </p>
          </div>
        </div>
      )}
      
      <div className="w-full flex flex-col items-center mt-[-60] bg-white z-10 relative">
        <div className="w-full max-w-2xl bg-white">
          {leaderboard.map((entry, idx) => (
            <div
              key={entry.id}
              className={`flex items-center border border-black bg-white${idx === 0 ? ' border-t' : ' border-t-0'}`}
            >
              <div className="w-10 flex justify-center items-center px-2 py-2 font-mono text-black font-semibold">
                {idx + 1}
              </div>
              <div className="w-16 flex justify-center items-center px-2 py-2">
                <img
                  src={entry.img}
                  alt={entry.name}
                  className="w-12 h-12 object-cover border border-black"
                  style={{ borderRadius: 0 }}
                />
              </div>
              <div className="flex-1 px-2 py-2 text-black">{entry.name}</div>
              <div className="w-20 px-2 py-2 text-black">{ordinal(entry.year)}</div>
              <div className="w-32 px-2 py-2 text-black flex gap-1">
                {entry.clubs.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </div>
              <div className="w-20 px-2 py-2 text-lg font-mono text-black text-right">{entry.elo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
