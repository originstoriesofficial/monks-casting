import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export const MonksCastingNavbar: React.FC = () => {
  return (
    <nav className="w-full py-3 px-4 sm:px-8 fixed top-0 z-50 bg-transparent font-secondary">
      <div className="flex justify-between items-center">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <h1 className="text-sm sm:text-2xl tracking-wide text-amber-100 font-bold font-secondary">
            Mønks Casting Studio
          </h1>
        </div>

        {/* Right Section: Key Icon & Connect Button */}
        <div className="flex items-center gap-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 opacity-80">
            <Image src="/images/key_monk.svg" alt="Key icon" width={40} height={40} />
          </div>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </nav>
  );
};
