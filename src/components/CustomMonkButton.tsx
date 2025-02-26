import Image from "next/image";
import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
}

const CustomMonkButton: React.FC<ButtonProps> = ({
  text,
  onClick,
  disabled = false,
  className = "",
  textClassName = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full sm:w-auto max-w-xs sm:max-w-sm flex justify-center items-center 
        transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/images/button_monk.svg"
          alt="Button Border"
          layout="fill"
          objectFit="contain"
          objectPosition="center"
          className="w-full h-auto max-w-[220px] sm:max-w-[260px]"
        />
      </div>

      {/* Button Text */}
      <span
        className={`relative z-10 text-xs sm:text-sm md:text-base text-center bg-transparent px-6 py-2 whitespace-nowrap ${textClassName}`}
      >
        {text}
      </span>
    </button>
  );
};

export default CustomMonkButton;
