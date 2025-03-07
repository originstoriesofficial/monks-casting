import Image from "next/image";
import React from "react";

interface ButtonProps {
  text: string | number;
  className?: string;
}

const CustomDiv: React.FC<ButtonProps> = ({ text, className = "" }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 
        text-[#D6C5AC] font-semibold transition-transform duration-200 hover:scale-105 
        disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* Background Image */}
      <span className="absolute inset-0 flex justify-center items-center">
        <Image
          src="/images/button_monk.svg"
          alt="Button Border"
          width={220} // Adjust width for desktop
          height={50} // Adjust height for desktop
          className="w-full max-w-[180px] sm:max-w-[220px] h-auto" // Responsive sizing
        />
      </span>

      {/* Button Text */}
      <span className="relative z-10 text-center text-[9px] text-ellipsis sm:text-sm md:text-base whitespace-nowrap max-w-full font-secondary">
        {text}
      </span>
    </div>
  );
};

export default CustomDiv;
