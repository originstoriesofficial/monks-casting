import Image from "next/image";
import React from "react";
import CustomDiv from "./CustomDiv";

interface StatsProps {
  className?: string;
  children: React.ReactNode;
  title?: string;
}

const Stats: React.FC<StatsProps> = ({ className = "", children, title }) => {
  return (
    <div className={`w-full max-w-xl mx-auto relative ${className} `}>
      {/* Main content box with art-deco border */}
      <div className="relative">
        {/* Border Frame */}
        <div className="relative ">
          <Image
            src="/images/break_div.svg"
            alt="Art deco border"
            width={1000}
            height={0}
          />

          {/* Main content area */}
          <div className="absolute inset-0 flex p-3 md:p-9 items-stretch justify-center">
            <div className="w-[95%]   flex flex-col items-left justify-between p-4">
              {title && (
                <div>
                  <CustomDiv text={title} />
                </div>
              )}
              <div className="w-full  flex">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
