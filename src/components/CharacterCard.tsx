mport React, { useState } from 'react';

const CharacterCard = ({ character = {} }) => {
  // Default character values if none provided
  const {
    name = "Character name",
    roleType = "Sidekick / Anti-hero",
    signatureMove = "Crypto Freeze",
    catchphrase = "Cold chains run deeper",
    hp = 70,
    statCard = {
      karma: "Zen",
      grit: "Legendary",
      mantraPower: "White Frost Projection",
      hustleSkill: "White Collar",
      signatureRelic: "Snowflake Medallion"
    },
    strengths = [
      "Blockchain wizardry",
      "Tech-savvy expertise",
      "Calm under pressure"
    ],
    weaknesses = [
      "Impatience with novices",
      "Overconfidence in cold weather",
      "Tendency to freeze assets"
    ]
  } = character;

  // Calculate filled dots for stats (max 5)
  const getFilledDots = (value) => {
    if (typeof value === 'number') return Math.min(value, 5);
    
    // Map text values to numbers
    const valueMap = {
      'low': 1,
      'medium': 3,
      'high': 4,
      'undetectable': 0,
      'iconic': 4,
      'legendary': 5,
      'fleeting': 2,
      'zen': 4,
      'hustler': 3,
      'chaos': 2
    };
    
    return valueMap[value.toLowerCase()] || 3;
  };

  // Render dots for stats
  const renderDots = (statName, value) => {
    const filledCount = getFilledDots(value);
    return (
      <div className="flex items-center mb-4">
        <div className="w-36 font-bold text-lg">{statName}</div>
        <div className="flex flex-grow">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`w-5 h-5 rounded-full mx-1 ${i < filledCount ? 'bg-yellow-400' : 'bg-gray-500 opacity-30'}`}
            />
          ))}
        </div>
        <div className="text-2xl font-bold w-12 text-right">
          {typeof value === 'number' ? value : filledCount * 5}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-gradient-to-br from-yellow-700 to-yellow-500 rounded-lg shadow-xl">
      {/* Left side - Stat Card */}
      <div className="w-full lg:w-2/5 p-6 flex flex-col">
        {/* Character image and basic info */}
        <div className="mb-4 relative">
          <div className="flex justify-between mb-2">
            <h2 className="text-3xl font-bold text-yellow-900">{name}</h2>
            <div className="flex items-center text-2xl font-bold">
              {hp} <div className="ml-2 w-6 h-6 bg-black rounded-full flex items-center justify-center"><span className="text-yellow-400 text-lg">⚡</span></div>
            </div>
          </div>
          
          <div className="bg-yellow-300 border-4 border-yellow-600 p-2 rounded-md shadow-md mb-3 min-h-56 flex items-center justify-center">
            <div className="text-center text-yellow-900 italic">Character Image</div>
          </div>
          
          <div className="bg-yellow-600 py-1 px-3 text-black font-bold rounded-full mb-4">
            {roleType}
          </div>
        </div>
        
        {/* Stats with dots */}
        <div className="flex-grow">
          {renderDots("Karma", statCard.karma)}
          {renderDots("Grit", statCard.grit)}
          {renderDots("Mantra Power", 4)}
          
          <div className="flex justify-between pt-6 pb-1 text-sm">
            <div className="w-1/3 text-center">weakness</div>
            <div className="w-1/3 text-center">strenght</div>
            <div className="w-1/3 text-center">retreat cost</div>
          </div>
          
          <div className="bg-yellow-600 p-3 rounded-md mt-2">
            <div><strong>Hustle Skill:</strong> {statCard.hustleSkill}</div>
            <div><strong>Signature Relic:</strong> {statCard.signatureRelic}</div>
          </div>
          
          <div className="mt-4 text-right text-xl font-bold">
            1/1 •
          </div>
        </div>
      </div>
      
      {/* Right side - Character Details */}
      <div className="w-full lg:w-3/5 bg-gradient-to-br from-yellow-900 to-yellow-800 text-yellow-100 p-6 rounded-r-lg flex flex-col">
        <div className="border-2 border-yellow-600 rounded-lg p-4 mb-4">
          <h3 className="text-xl font-bold mb-2">Stat Card</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="font-bold">Karma</div>
            <div className="col-span-3">{statCard.karma}</div>
            
            <div className="font-bold">Grit</div>
            <div className="col-span-3">{statCard.grit}</div>
            
            <div className="font-bold">Mantra Power</div>
            <div className="col-span-3">{statCard.mantraPower}</div>
            
            <div className="font-bold">Hustle Skill</div>
            <div className="col-span-3">{statCard.hustleSkill}</div>
            
            <div className="font-bold">Signature Relic</div>
            <div className="col-span-3">{statCard.signatureRelic}</div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          <div className="w-full md:w-1/2 border-2 border-yellow-600 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">Weaknesses</h3>
            <ul className="list-disc pl-5">
              {weaknesses.map((weakness, index) => (
                <li key={index} className="mb-2">{weakness}</li>
              ))}
            </ul>
          </div>
          
          <div className="w-full md:w-1/2 border-2 border-yellow-600 rounded-lg p-4">
            <h3 className="text-xl font-bold mb-2">Strengths</h3>
            <ul className="list-disc pl-5">
              {strengths.map((strength, index) => (
                <li key={index} className="mb-2">{strength}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4 border-2 border-yellow-600 rounded-lg p-4">
          <div className="mb-2">
            <span className="font-bold">Signature Move:</span> {signatureMove}
          </div>
          <div>
            <span className="font-bold">Catchphrase:</span> "{catchphrase}"
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;