import React, { Suspense } from 'react';
import StudioClient from '@/components/StudioClient';
import InspirationSelector from '@/components/InspirationSelector';

export const dynamic = 'force-dynamic'; // 🚀 disables static rendering

export default function StudioPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-[#e3d7b6]">
      <div className="relative border-4 border-[#bfa36f] rounded-lg p-6 w-[90%] max-w-3xl mx-auto">
        <InspirationSelector />
        <div className="mt-8 w-full">
          <Suspense fallback={<div>Loading Studio...</div>}>
            <StudioClient />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
