"use client"
import Header from "../src/Header";
import React, { useEffect, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getLeaderboard } from "../src/services/api";
import { clubs } from "../src/data/clubs";
const SplineIcon = dynamic(() => import('../src/SplineIcon'), { ssr: false });


// Interface for leaderboard entry from the API
interface LeaderboardEntry {
  id?: string;
  _id?: string;
  name: string;
  education?: {
    graduation_year?: number;
  };
  clubs?: {
    id: string;
    name: string;
  }[];
  elo_rating: number;
  photo_url?: string;
}

export default function Home() {
  const [showMiniLogo, setShowMiniLogo] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        // Debug the data structure
        console.log('Leaderboard data:', data);
        
        // Ensure each entry has an id
        const processedData = data.map((entry: LeaderboardEntry, index: number) => {
          // If the entry doesn't have an id or it's undefined, use _id or generate one
          if (!entry.id) {
            return {
              ...entry,
              id: entry._id || `generated-id-${index}`
            };
          }
          return entry;
        });
        
        setLeaderboard(processedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
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
      
      <div className="w-full flex flex-col items-center mt-[-60] bg-white z-10 relative">
        <div className="w-full max-w-2xl bg-white">
          {loading ? (
            <div key="loading" className="p-8 text-center text-black">Loading leaderboard...</div>
          ) : leaderboard.length === 0 ? (
            <div key="empty" className="p-8 text-center text-black">No leaderboard data available.</div>
          ) : (
            leaderboard.map((entry, idx) => (
              <div
                key={`leaderboard-entry-${entry.id || idx}`}
                className={`flex items-center border border-black bg-white${idx === 0 ? ' border-t' : ' border-t-0'}`}
              >
                <div className="w-10 flex justify-center items-center px-2 py-2 font-mono text-black font-semibold">
                  {idx + 1}
                </div>
                <div className="w-16 flex justify-center items-center px-2 py-2">
                  <div className="w-12 h-12 border border-black relative">
                    <Image
                      src={entry.photo_url || '/images/profile-placeholder.png'}
                      alt={entry.name}
                      fill
                      sizes="48px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
                <div className="flex-1 px-2 py-2 text-black">{entry.name}</div>
                <div className="w-28 px-2 py-2 text-black">
                  {entry.education?.graduation_year ? `Class: ${entry.education.graduation_year}` : 'Class: N/A'}
                </div>
                <div className="w-32 px-2 py-2 text-black flex gap-1">
                  {entry.clubs && entry.clubs.map((club) => {
                    // Find the club in our clubs data to get the logo
                    const clubData = clubs.find(c => c.id === club.id);
                    return (
                      <div key={club.id} className="w-6 h-6 relative" title={club.name}>
                        {clubData ? (
                          <Image
                            src={clubData.logo}
                            alt={club.name}
                            fill
                            sizes="24px"
                            style={{ objectFit: 'contain' }}
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 flex items-center justify-center text-xs">
                            {club.name.substring(0, 1)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="w-20 px-2 py-2 text-lg font-mono text-black text-right">{entry.elo_rating}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
