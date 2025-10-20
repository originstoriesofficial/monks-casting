'use client';

import React, { Suspense } from 'react';
import InspirationSelector from '@/components/InspirationSelector';
import StudioClient from '@/components/StudioClient';

// 🚀 Prevents Vercel static prerender crash (due to useSearchParams)
export const dynamic = 'force-dynamic';

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="text-amber-300 mt-10">Loading Studio...</div>}>
      <main className="min-h-screen flex flex-col items-center justify-center bg-black text-[#e3d7b6] px-4 py-10">
        {/* Outer Ornate Frame */}
        <div
          className="
            relative border-4 border-[#bfa36f]
            rounded-lg p-8 w-full max-w-4xl mx-auto
            bg-black/70 shadow-[0_0_30px_rgba(191,163,111,0.2)]
            flex flex-col items-center justify-start
          "
        >
          {/* Inspiration Section (top of frame) */}
          <div className="w-full mb-10">
            <InspirationSelector />
          </div>

          {/* Divider Line (optional aesthetic touch) */}
          <div className="w-3/4 border-t border-[#bfa36f]/40 my-6"></div>

          {/* Studio Client Section (bottom of frame) */}
          <div className="w-full">
            <StudioClient />
          </div>
        </div>
      </main>
    </Suspense>
  );
}
