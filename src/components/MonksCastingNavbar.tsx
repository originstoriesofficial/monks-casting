import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export const MonksCastingNavbar: React.FC = () => {
  return (
    <nav className="w-full py-3 px-4 sm:px-8 fixed top-0 z-50 bg-transparent font-secondary">
      <div className="flex justify-between items-center">
        {/* Left Section: Logo & Nav Links */}
        <div className="flex items-center gap-6">
          <h1 className="text-sm sm:text-2xl tracking-wide text-amber-100 font-bold font-secondary">
            Mønks Casting Studio
          </h1>

          {/* Nav Links */}
          <div className="hidden sm:flex gap-4 text-sm text-amber-100">
            <a href="/drops" className="hover:underline">📦 Drops</a>
            <a href="/world" className="hover:underline">🌍 World Studio</a>
          </div>
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
