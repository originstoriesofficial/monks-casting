import Image from "next/image";
import React from "react";

interface CustomInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: string;
}

const CustomMonkInput: React.FC<CustomInputProps> = ({
  placeholder = "Enter text...",
  value,
  onChange,
  disabled = false,
  className = "",
  type = "text",
}) => {
  return (
    <div className={`relative inline-block w-full max-w-xs ${className}`}>
      {/* Decorative Border */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
          src="/images/button_monk.svg"
          alt="Input Border"
          width={220} // Adjust width as needed
          height={50} // Adjust height as needed
        />
      </div>

      {/* Input Field */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="relative w-full px-6 py-2 text-center bg-transparent  placeholder-[#D6C5AC] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ caretColor: "white" }} // White caret for visibility
      />
    </div>
  );
};

export default CustomMonkInput;
