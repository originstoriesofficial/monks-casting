/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// CharacterProfile.tsx
import React from "react";
import Image from "next/image";
import { MonksCastingFrame } from "./MonksCastingFrame";
import CustomDiv from "./CustomDiv";
import Stats from "./Stats";
import CharacterCard from "./CharacterCard";



const CharacterProfile = ({ characterData }: { characterData: any }) => {

 console.log(characterData,"here see here here")
console.log(characterData?.name)
  return (
    <div className="text-amber-100 min-h-fit p-6 font-secondary">
      {/* Blue border wrapper */}
      <div className=" mx-auto  p-6  ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Character Image Panel */}
          <div className="lg:col-span-1">
            <CharacterCard characterData={characterData} />

            {/* Character Info Tabs */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <CustomDiv text={characterData?.name} />
              <CustomDiv text={characterData?.roleType} />
              <CustomDiv text={characterData?.hp} />
            </div>
          </div>

          {/* Stats and Info Panels */}
          <div className="lg:col-span-2 ">
            {/* Stat Card with Header */}
           <Stats>
              <div className="flex flex-col gap-1 md:gap-4 w-full h-full  ">
              

              
                <div className="flex w-full justify-between items-center  ">
                  <span className="w-28 text-amber-200 text-nowrap text-[9px] sm:text-base">
                    Name
                  </span>
                  <span className="text-amber-100 text-[9px] sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {characterData?.name}
                  </span>
                </div>

         
                <div className="flex w-full justify-between items-center ">
                  <span className="w-28 text-nowrap text-amber-200 text-[9px] sm:text-base">
                   Role
                  </span>
                  <span className="text-amber-100 text-[9px] sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {characterData?.roleType}
                  </span>
                </div>
                <div className="flex w-full justify-between items-center ">
                  <span className="w-28 text-nowrap text-amber-200 text-[9px] sm:text-base">
                   Signature
                  </span>
                  <span className="text-amber-100 text-[9px] sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {characterData?.signatureMove}
                  </span>
                </div>
                <div className="flex w-full justify-between items-center ">
                  <span className="w-28 text-nowrap text-amber-200 text-[9px] sm:text-base">
                   Catchphrase
                  </span>
                  <span className="text-amber-100 text-[9px] sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                    {characterData?.catchphrase}
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
                      {characterData?.weaknesses?.map((weakness:string, index:number) => (
                        <li
                          key={index}
                          className="text-amber-100 text-[9px] md:text-base"
                        >
                          {weakness}
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
                      {characterData?.strengths?.map((strength:string, index:number) => (
                        <li
                          key={index}
                          className="text-amber-100 text-[9px] md:text-base"
                        >
                          {strength}
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
