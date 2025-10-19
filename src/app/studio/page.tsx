'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

const styles = [
  'Electronic', 'Hip-Hop', 'Trap', 'Lo-fi', 'Jazz', 'Ambient', 'Synthwave',
  'Orchestral', 'Fantasy', 'Cyberpunk', 'Retro', 'Rock', 'Funk', 'Drill',
  'Dubstep', 'Techno', 'Industrial', 'Afrobeats', 'Pop', 'Ballad', 'Hardstyle',
  'Epic', 'Darkwave', 'R&B', 'Chillwave', 'Glitch', 'Punk', 'EDM', 'Metal',
  'Reggaeton', 'Acoustic', 'Minimal', 'Experimental', 'Dream Pop', 'Gospel',
  'Neo Soul', 'Boom Bap', 'Future Bass', 'Trap Soul', 'Post-Rock', 'Shoegaze',
  'Vaporwave', 'Bossa Nova', 'Trance'
];

const StudioPage = () => {
  const searchParams = useSearchParams();
  const defaultLore = searchParams.get('lore') || '';

  const [prompt, setPrompt] = useState(defaultLore);
  const [lyrics, setLyrics] = useState('');
  const [style, setStyle] = useState(styles[0]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSong = async () => {
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const fullPrompt = `${prompt} in the style of ${style}. ${
        lyrics ? 'Lyrics: ' + lyrics : ''
      }`;

      const response = await fetch('https://api.elevenlabs.io/v1/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          music_length_ms: 60000,
          output_format: 'mp3_44100_128',
        }),
      });

      if (!response.ok) {
        const errBody = await response.json();
        throw new Error(errBody?.detail?.message || 'Failed to generate track');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: any) {
      console.error('Error generating music:', err);
      setError('Something went wrong while generating music.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-black">
      <h1 className="text-3xl font-bold mb-6">🎶 Studio</h1>

      <label className="block mb-2 text-sm font-medium">Lore Prompt</label>
      <textarea
        className="w-full p-3 mb-4 bg-gray-800 rounded text-sm"
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <label className="block mb-2 text-sm font-medium">Optional Lyrics</label>
      <textarea
        className="w-full p-3 mb-4 bg-gray-800 rounded text-sm"
        rows={2}
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        placeholder="Add lyrics if you'd like..."
      />

      <label className="block mb-2 text-sm font-medium">Music Style</label>
      <select
        className="w-full p-3 mb-6 bg-gray-800 rounded text-sm"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      >
        {styles.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        onClick={generateSong}
        disabled={loading}
        className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Song'}
      </button>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {audioUrl && (
        <div className="mt-6">
          <h2 className="text-xl mb-2">Preview</h2>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}
    </div>
  );
};

export default StudioPage;
