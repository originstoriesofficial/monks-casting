'use client';

import React, { Suspense } from 'react';
import StudioClient from '@/components/StudioClient';

export const dynamic = 'force-dynamic'; // ensures client-side rendering

export default function StudioPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading Studio...</div>}>
      <StudioClient />
    </Suspense>
  );
}
