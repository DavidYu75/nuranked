import React from "react";
import ProfileCard, { ProfileProps } from "./ProfileCard";

interface ResultsDisplayProps {
  winnerProfile: ProfileProps;
  loserProfile: ProfileProps;
  onContinue: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  winnerProfile,
  loserProfile,
  onContinue,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-2">Results</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
        Names and photos are now revealed!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full shadow-lg text-sm font-bold z-10">
            Selected
          </div>
          <div className="border-2 border-green-500 rounded-lg overflow-hidden">
            <ProfileCard {...winnerProfile} />
          </div>
        </div>

        <div>
          <ProfileCard {...loserProfile} />
        </div>
      </div>

      <div className="text-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-8">
        <h2 className="font-bold text-lg mb-2">ELO Rating Update</h2>
        <p>
          <span className="font-medium">{winnerProfile.name}:</span>{" "}
          {winnerProfile.elo_rating - 8} → {winnerProfile.elo_rating} (+8)
        </p>
        <p>
          <span className="font-medium">{loserProfile.name}:</span>{" "}
          {loserProfile.elo_rating + 8} → {loserProfile.elo_rating} (-8)
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Next Match
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
