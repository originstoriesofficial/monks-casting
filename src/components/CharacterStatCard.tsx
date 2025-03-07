// components/CharacterStatCard.tsx
import React from 'react';
import Image from 'next/image';

interface StatCardProps {
  character: {
    name: string;
    roleType: string;
    signatureMove: string;
    catchphrase: string;
    hp: number;
    statCard: {
      karma: string;
      grit: string;
      mantraPower: string;
      hustleSkill: string;
      signatureRelic: string;
    };
    strengths: string[];
    weaknesses: string[];
  };
  tokenId: string | number;
  animal: string;
  color: string;
  imageUrl?: string;
}

const CharacterStatCard: React.FC<StatCardProps> = ({
  character,
  tokenId,
  animal,
  color,
  imageUrl = '/placeholder-monk.png', // Default placeholder image
}) => {
  const { name, roleType, signatureMove, catchphrase, hp, statCard, strengths, weaknesses } = character;
  
  // Function to render rating dots (filled and unfilled)
  const renderRating = (value: string) => {
    // Map string values to numeric ratings
    let rating = 3; // Default to 3/5
    
    // For karma
    if (value === 'Zen') rating = 3;
    if (value === 'Hustler') rating = 4;
    if (value === 'Chaos') rating = 5;
    
    // For grit
    if (value === 'Low') rating = 1;
    if (value === 'Medium') rating = 3;
    if (value === 'High') rating = 4;
    if (value === 'Undetectable') rating = 1;
    if (value === 'Iconic') rating = 4;
    if (value === 'Legendary') rating = 5;
    if (value === 'Fleeting') rating = 2;
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className={`w-4 h-4 rounded-full ${dot <= rating ? 'bg-yellow-400' : 'bg-gray-400 opacity-50'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      {/* Gold card section */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg p-4 shadow-lg">
        {/* Character header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <div className="flex items-center">
            <span className="font-bold mr-1">HP</span> 
            <span className="bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center">{hp}</span>
          </div>
        </div>
        
        {/* Character image */}
        <div className="relative w-full h-48 bg-gray-900 rounded-lg mb-4 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-contain"
          />
          <div className="absolute bottom-0 w-full bg-black bg-opacity-70 p-1 text-center text-white">
            "{catchphrase}"
          </div>
        </div>
        
        {/* Token info */}
        <div className="text-xs text-center mb-4 text-gray-900">
          # TOKEN ID: {tokenId} • {animal} ({color}) ATTRIBUTE
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <div className="col-span-1 text-gray-900 font-bold">Karma</div>
          <div className="col-span-3">{renderRating(statCard.karma)}</div>
          <div className="col-span-1 text-right text-gray-900">{statCard.karma}</div>
          
          <div className="col-span-1 text-gray-900 font-bold">Grit</div>
          <div className="col-span-3">{renderRating(statCard.grit)}</div>
          <div className="col-span-1 text-right text-gray-900">{statCard.grit}</div>
          
          <div className="col-span-1 text-gray-900 font-bold">Mantra Power</div>
          <div className="col-span-3">{renderRating('Medium')}</div>
          <div className="col-span-1 text-right text-gray-900">{statCard.mantraPower}</div>
        </div>
        
        {/* Signature moves and skills */}
        <div className="text-sm mb-2">
          <div><strong>Signature Move:</strong> {signatureMove}</div>
          <div><strong>Signature Relic:</strong> {statCard.signatureRelic}</div>
          <div><strong>Hustle Skill:</strong> {statCard.hustleSkill}</div>
        </div>
      </div>
      
      {/* Strengths and weaknesses section */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mt-6">
        <div className="border border-yellow-600 rounded-lg p-4">
          <h3 className="text-center text-lg font-bold mb-2 border-b border-yellow-600 pb-2">Strengths</h3>
          <ul className="list-disc pl-5">
            {strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className="border border-yellow-600 rounded-lg p-4">
          <h3 className="text-center text-lg font-bold mb-2 border-b border-yellow-600 pb-2">Weaknesses</h3>
          <ul className="list-disc pl-5">
            {weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CharacterStatCard;