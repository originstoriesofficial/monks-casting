import { NextResponse } from 'next/server';

// This ensures Vercel treats this as a dynamic route and doesn’t try to prerender it
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, music_length_ms = 60000, output_format = 'mp3_44100_128' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error('Missing ELEVENLABS_API_KEY in environment variables');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Call ElevenLabs API
    const elevenResponse = await fetch('https://api.elevenlabs.io/v1/music/generate', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        music_length_ms,
        output_format,
      }),
    });

    if (!elevenResponse.ok) {
      const errText = await elevenResponse.text();
      console.error('ElevenLabs error:', errText);
      return NextResponse.json(
        { error: 'Failed to generate music', details: errText },
        { status: elevenResponse.status }
      );
    }

    // Stream the MP3 back to the frontend
    const audioBuffer = await elevenResponse.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="generated.mp3"',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/compose:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// Optional: Disallow GET requests to prevent accidental access
export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
