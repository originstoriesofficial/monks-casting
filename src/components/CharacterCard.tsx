/* eslint-disable @next/next/no-img-element */
import React from "react";

interface CharacterData {
  name: string;
  score: string;
  image: string;
  signatureMove: string;
  statCard: {
    hustleSkill: string;
    karma: string;
    grit: string;
    mantraPower: string;
    signatureRelic: string;
  };
  karmaValue: number;
  gritValue: number;
  mantraValue: number;
}

const CharacterCard: React.FC<{ characterData?: CharacterData }> = ({
  characterData,
}) => {
  const defaultCharacter = {
    name: "Frost Sage",
    score: "",
    image: "/placeholder.png",
    signatureMove: "Crypto Freeze",
    statCard: {
      hustleSkill: "White Collar",
      karma: "Zen",
      grit: "Legendary",
      mantraPower: "White Frost Projection",
      signatureRelic: "Snowflake medallion",
    },
    karmaValue: 3,
    gritValue: 3,
    mantraValue: 5,
  };

  const character = characterData || defaultCharacter;

  const renderDots = (value: number, max = 5) => {
    return Array.from({ length: max }).map((_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full border border-gray-400 ${
          index < value ? "bg-amber-200" : "bg-gray-500"
        }`}
      />
    ));
  };

  return (
    <div
      className="w-full max-w-xs mx-auto overflow-hidden rounded-3xl border-[2.14px] border-[#757575]"
      style={{
        background:
          "conic-gradient(from 180deg at 50% 50%, #B18A42 0deg, #9A7904 16.88deg, #DCA310 88.12deg, #9A7904 151.87deg, #9A7904 225deg, #9A7904 288.75deg, #B18A42 360deg)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 pt-2 pb-1">
        <h2 className="text-lg font-serif text-black">{character.name}</h2>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-white">score</span>
          <div className="bg-amber-600 rounded-full w-4 h-4 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Character Image */}
      <div className="mx-3 my-1">
        <div className="p-1 bg-gradient-to-br from-amber-300 to-amber-400 border-2 border-amber-300">
          <div className="bg-gradient-to-br from-amber-200 to-amber-400 p-1">
            {character.image && (
              <div
                className="w-full relative"
                style={{ paddingBottom: "56.25%" }}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hustle Skill */}
      <div
        className="mx-3 my-1 py-1 px-2 rounded-tl-3xl rounded-br-3xl"
        style={{
          borderBottom: "3.41px solid",
          borderRight: "3.41px solid",
          borderImageSource:
            "linear-gradient(90deg, #9A7904 0%, #B18A42 20.48%, #CEA801 36.2%, #1A0D05 55.63%, #D5D5D5 78.99%, #DFCE3D 97.32%)",
          borderImageSlice: "1",
          background:
            "linear-gradient(90deg, #C3A30D 1.52%, #FEEB0A 24.12%, #D4BA27 37.49%, #FFED0B 51.06%, #CEA801 66.52%, #F3E22F 79.99%, #C8AF10 92.2%)",
        }}
      >
        <h3 className="text-xs font-serif text-white">
          Hustle: {character.statCard?.hustleSkill || "Shady"}
        </h3>
      </div>

      {/* Stats Section */}
      <div className="px-3 space-y-4 pb-3 bg-[#1b140a] bg-opacity-90 rounded-b-3xl shadow-inner">

        {/* Alignment */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-serif text-amber-200">Alignment</h3>
            <span className="text-xs text-white">
              {character.statCard?.karma || "Hustler"}
            </span>
          </div>
          <div className="flex gap-1">
            {renderDots(character.karmaValue || 5)}
          </div>
          <hr className="border-[#333] my-1" />
        </div>

        {/* Resilience */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-serif text-amber-200">Resilience</h3>
            <span className="text-xs text-white">
              {character.statCard?.grit || "High"}
            </span>
          </div>
          <div className="flex gap-1">
            {renderDots(character.gritValue || 5)}
          </div>
          <hr className="border-[#333] my-1" />
        </div>

        {/* Essence */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-serif text-amber-200">Essence</h3>
            <span className="text-xs text-white truncate max-w-[160px]">
              {character.statCard?.mantraPower || "Arctic Freeze"}
            </span>
          </div>
          <div className="flex gap-1">
            {renderDots(character.mantraValue || 5)}
          </div>
        </div>

        {/* Signature Move & Relic */}
        <div className="p-3 mt-3 rounded-lg text-[10px] leading-snug bg-[#2c1d0f] border border-[#8b734b]">
          <p className="text-white mb-1">
            <span className="font-semibold text-amber-300">Move:</span>{" "}
            {character?.signatureMove || "Unknown"}
          </p>
          <p className="text-white">
            <span className="font-semibold text-amber-300">Relic:</span>{" "}
            {character.statCard?.signatureRelic ||
              "A custom-built, turquoise-encased quantum key distribution device"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
