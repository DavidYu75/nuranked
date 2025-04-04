'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import DefaultAvatar from './DefaultAvatar';

interface Experience {
  title: string;
  company: string;
  description: string;
}

interface Education {
  degree: string;
  major: string;
  graduation_year: number;
}

export interface ProfileProps {
  id: string;
  name: string;
  photo_url: string;
  experiences: Experience[];
  education: Education;
  elo_rating: number;
  match_count: number;
  linkedin_url?: string;
  github_url?: string;
  revealed: boolean; // Whether to show name and photo
}

const ProfileCard: React.FC<ProfileProps> = ({
  id,
  name,
  photo_url,
  experiences,
  education,
  elo_rating,
  match_count,
  linkedin_url,
  github_url,
  revealed
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-center mb-4">
          <div className="h-16 w-16 mr-4">
            {revealed ? (
              // If profile is revealed and we have a photo URL, try to use it
              photo_url && photo_url.startsWith('/') ? (
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  <Image 
                    src={photo_url}
                    alt={name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
              ) : (
                // Otherwise use our default avatar component with initials
                <DefaultAvatar 
                  initials={name.split(' ').map(n => n[0]).join('')}
                  size={64}
                />
              )
            ) : (
              // When not revealed, show a blurred placeholder
              <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 blur-sm flex items-center justify-center">
                <span className="text-transparent">Photo</span>
              </div>
            )}
          </div>
          
          <div>
            {revealed ? (
              <h2 className="text-xl font-bold">{name}</h2>
            ) : (
              <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 blur-sm rounded"></div>
            )}
            <p className="text-gray-500 dark:text-gray-400">
              {education.major} | Class of {education.graduation_year}
            </p>
          </div>
        </div>
        
        {/* Experiences */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Experience</h3>
          <div className="space-y-3">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-500 pl-3">
                <p className="font-medium">{exp.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                <p className="text-sm mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Education */}
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2">Education</h3>
          <div className="border-l-2 border-green-500 pl-3">
            <p className="font-medium">{education.degree}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {education.major} (Class of {education.graduation_year})
            </p>
          </div>
        </div>
        
        {/* Stats */}
        {revealed && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <div>
                <span className="font-bold">ELO Rating:</span> {elo_rating}
              </div>
              <div>
                <span className="font-bold">Matches:</span> {match_count}
              </div>
            </div>
            
            {/* Links */}
            {(linkedin_url || github_url) && (
              <div className="mt-3 flex space-x-3">
                {linkedin_url && (
                  <a 
                    href={linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    LinkedIn
                  </a>
                )}
                {github_url && (
                  <a 
                    href={github_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:underline text-sm"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
