'use client';

import React, { useState, useEffect } from 'react';
import ProfileCard, { ProfileProps } from './ProfileCard';
import { getRandomProfiles, voteProfile } from '@/src/services/api';

const VotingInterface: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileProps[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState('');

  // Fetch random profiles on component mount
  useEffect(() => {
    fetchRandomProfiles();
  }, []);

  const fetchRandomProfiles = async () => {
    setIsLoading(true);
    setSelectedProfileId(null);
    setError('');
    
    try {
      // This would be replaced with actual API data
      const response = await getRandomProfiles();
      
      // For now, we'll use mock data
      const mockProfiles: ProfileProps[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          photo_url: '/placeholder-woman.png', // Use local placeholder image
          experiences: [
            {
              title: 'Software Engineer Intern',
              company: 'Amazon',
              description: 'Worked on AWS Lambda service team'
            },
            {
              title: 'Teaching Assistant',
              company: 'Northeastern University',
              description: 'Algorithms and Data Structures'
            }
          ],
          education: {
            degree: 'BS',
            major: 'Computer Science',
            graduation_year: 2025
          },
          elo_rating: 1520,
          match_count: 12,
          linkedin_url: 'https://linkedin.com',
          github_url: 'https://github.com',
          revealed: false
        },
        {
          id: '2',
          name: 'Taylor Smith',
          photo_url: '/placeholder-man.png', // Use local placeholder image
          experiences: [
            {
              title: 'Machine Learning Intern',
              company: 'Google',
              description: 'Developed ML models for image recognition'
            },
            {
              title: 'Research Assistant',
              company: 'Northeastern University',
              description: 'Computer Vision Lab'
            }
          ],
          education: {
            degree: 'MS',
            major: 'Artificial Intelligence',
            graduation_year: 2024
          },
          elo_rating: 1550,
          match_count: 15,
          linkedin_url: 'https://linkedin.com',
          revealed: false
        }
      ];
      
      setProfiles(mockProfiles);
    } catch (err) {
      setError('Failed to fetch profiles. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (profileId: string) => {
    setIsVoting(true);
    setSelectedProfileId(profileId);
    
    try {
      // This would be replaced with actual API call
      //await voteProfile(profileId);
      
      // For now, we just reveal the profiles
      setProfiles(profiles.map(profile => ({
        ...profile,
        revealed: true
      })));
    } catch (err) {
      setError('Failed to record vote. Please try again.');
      console.error(err);
    } finally {
      setIsVoting(false);
    }
  };

  const handleNextMatch = () => {
    fetchRandomProfiles();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchRandomProfiles}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const allRevealed = profiles.every(profile => profile.revealed);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Who is more impressive?</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {profiles.map((profile) => (
          <div key={profile.id} className="relative">
            <button
              className={`w-full h-full ${selectedProfileId === profile.id ? 'ring-4 ring-blue-500' : ''}`}
              onClick={() => !allRevealed && handleVote(profile.id)}
              disabled={isVoting || allRevealed}
            >
              <ProfileCard {...profile} />
            </button>
            
            {selectedProfileId === profile.id && !allRevealed && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        {allRevealed ? (
          <button
            onClick={handleNextMatch}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Next Match
          </button>
        ) : (
          <p className="text-gray-500 italic">Click on a profile to vote</p>
        )}
      </div>
    </div>
  );
};

export default VotingInterface;
