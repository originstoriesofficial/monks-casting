import { NextRequest } from 'next/server';
import { fal } from '@fal-ai/client';

fal.config({
  credentials: process.env.FAL_AI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const result = await fal.subscribe('fal-ai/stable-cascade', {
    input: { prompt },
    logs: true,
  });

  const imageUrl = result?.data?.images?.[0]?.url || null;

  return Response.json({ imageUrl });
}
