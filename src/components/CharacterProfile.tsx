/* eslint-disable @typescript-eslint/no-unused-vars */
// CharacterProfile.tsx
import React from "react";
import Image from "next/image";
import { MonksCastingFrame } from "./MonksCastingFrame";
import CustomDiv from "./CustomDiv";
import Stats from "./Stats";

interface StatRating {
  name: string;
  value: number;
  maxValue: number;
}

interface CharacterSkill {
  name: string;
  description: string;
}

interface CharacterTrait {
  name: string;
}

interface CharacterProfileProps {
  name: string;
  catchphrase?: string;
  role: string;
  age: string;
  image: string;
  stats: StatRating[];
  skills: CharacterSkill[];
  relic: string;
  strengths: CharacterTrait[];
  weaknesses: CharacterTrait[];
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({
  name,
  catchphrase,
  role,
  age,
  image,
  stats,
  skills,
  relic,
  strengths,
  weaknesses,
}) => {
  return (
    <div className="text-amber-100 min-h-fit p-6 font-secondary">
      {/* Blue border wrapper */}
      <div className=" mx-auto  p-6  ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Image Panel */}
          <div className="lg:col-span-1">
            <MonksCastingFrame>
              <div className="flex  flex-col items-center justify-center w-full h-full">
                <div className="relative w-full aspect-square">
                  <img src={image} alt={name} className="object-contain" />
                </div>
                {catchphrase && (
                  <p className="text-center  italic text-amber-200">
                    &quot;{catchphrase}&quot;
                  </p>
                )}
              </div>
            </MonksCastingFrame>

            {/* Character Info Tabs */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <CustomDiv text={name} />
              <CustomDiv text={role} />
              <CustomDiv text={age} />
            </div>
          </div>

          {/* Stats and Info Panels */}
          <div className="lg:col-span-2 ">
            {/* Stat Card with Header */}
            <Stats>
              <div className="flex flex-col gap-1 md:gap-4 w-full h-full  ">
                {stats.map((stat) => (
                  <div
                    key={stat.name}
                    className="flex items-center justify-between w-full"
                  >
                    {/* Stat Name */}
                    <span className="w-28 text-amber-200 text-[9px] sm:text-base  ">
                      {stat.name}
                    </span>

                    {/* Stat Circles */}
                    <div className="flex space-x-1 flex-nowrap">
                      {Array.from({ length: stat.maxValue }).map((_, i) => (
                        <div
                          key={i}
                          className={`md:w-6 md:h-6 w-2 h-2 rounded-full border border-amber-300 ${
                            i < stat.value
                              ? "bg-gradient-to-br from-amber-200 to-amber-600"
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Hustle Skill Section */}
                <div className="flex w-full justify-between items-center  ">
                  <span className="w-28 text-amber-200 text-nowrap text-[9px] sm:text-base">
                    Hustle Skill
                  </span>
                  <span className="text-amber-100 text-[9px] sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {skills.map((skill) => skill.name).join(" + ")}
                  </span>
                </div>

                {/* Signature Relic Section */}
                <div className="flex w-full justify-between items-center ">
                  <span className="w-28 text-nowrap text-amber-200 text-[9px] sm:text-base">
                    Signature Relic
                  </span>
                  <span className="text-amber-100 text-[9px] sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {relic}
                  </span>
                </div>
              </div>
            </Stats>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-24">
              {/* Weaknesses Panel with Header */}

              <Stats>
                <div className="relative w-full max-w-2xl mx-auto">
                  {/* Weaknesses Header */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                    <CustomDiv
                      text="Weaknesses"
                      className="px-6 sm:px-8 text-center"
                    />
                  </div>

                  {/* Weaknesses List */}
                  <div className="w-full p-4 pt-7 sm:pt-12  rounded-lg">
                    <ul className="list-disc  sm:pl-3  text-sm sm:text-base md:text-lg">
                      {weaknesses.map((weakness, index) => (
                        <li
                          key={index}
                          className="text-amber-100 text-[9px] md:text-base"
                        >
                          {weakness.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Stats>

              <Stats>
                <div className="relative w-full max-w-2xl mx-auto">
                  {/* Strengths Header */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
                    <CustomDiv
                      text="Strengths"
                      className="px-6 sm:px-8 text-center"
                    />
                  </div>

                  {/* Strengths List */}
                  <div className="w-full p-4 pt-7 sm:pt-12  rounded-lg">
                    <ul className="list-disc  sm:pl-3  text-sm sm:text-base md:text-lg">
                      {strengths.map((strength, index) => (
                        <li
                          key={index}
                          className="text-amber-100 text-[9px] md:text-base"
                        >
                          {strength.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Stats>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfile;
