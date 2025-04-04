import React from 'react';
import VotingInterface from '@/src/components/VotingInterface';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-blue-600 dark:bg-blue-800 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Northeastern CS Ranked</h1>
          <p className="text-center text-blue-100">Who's the most impressive CS talent at Northeastern?</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <VotingInterface />
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-800 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Northeastern CS Ranked © 2025</p>
          <p className="mt-1">An ELO-based ranking of CS talent at Northeastern University</p>
        </div>
      </footer>
    </div>
  );
}
