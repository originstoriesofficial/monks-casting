'use client';

import React from 'react';
import StudioClient from '@/components/StudioClient';
import InspirationSelector from '@/components/InspirationSelector';

export default function StudioPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-[#e3d7b6]">
      {/* Ornate Frame Container */}
      <div className="relative border-4 border-[#bfa36f] rounded-lg p-6 w-[90%] max-w-3xl mx-auto">
        {/* Inspiration Library inside the frame */}
        <InspirationSelector />

        {/* The full studio client (music generator + UI) */}
        <div className="mt-8 w-full">
          <StudioClient />
        </div>
      </div>
    </main>
  );
}
