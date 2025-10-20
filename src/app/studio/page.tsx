'use client';

import React, { Suspense } from 'react';
import InspirationSelector from '@/components/InspirationSelector';
import StudioClient from '@/components/StudioClient';

export default function StudioPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-[#e3d7b6] p-8">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#e3d7b6] mb-2 tracking-wide">
            🎧 Create Your Own MØNK Anthem
          </h1>
          <p className="text-sm md:text-base text-[#bfa36f]/90">
            Transform your lore into sound. Choose an inspiration or write your own story below.
          </p>
        </div>

        {/* Inspiration Box (only one, clean) */}
        <div className="relative border-4 border-[#bfa36f] rounded-lg p-8 w-full bg-black/70">
          <Suspense fallback={<div>Loading inspiration...</div>}>
            <InspirationSelector />
          </Suspense>
        </div>

        {/* StudioClient below */}
        <Suspense fallback={<div>Loading studio tools...</div>}>
          <StudioClient />
        </Suspense>
      </div>
    </main>
  );
}
