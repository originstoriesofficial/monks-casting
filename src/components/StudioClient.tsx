'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Stats from '@/components/Stats';
import CustomDiv from '@/components/CustomDiv';

const styles = [
  'Electronic', 'Hip-Hop', 'Trap', 'Lo-fi', 'Jazz', 'Ambient', 'Synthwave',
  'Orchestral', 'Fantasy', 'Cyberpunk', 'Retro', 'Rock', 'Funk', 'Drill',
  'Dubstep', 'Techno', 'Industrial', 'Afrobeats', 'Pop', 'Ballad', 'Hardstyle',
  'Epic', 'Darkwave', 'R&B', 'Chillwave', 'Glitch', 'Punk', 'EDM', 'Metal',
  'Reggaeton', 'Acoustic', 'Minimal', 'Experimental', 'Dream Pop', 'Gospel',
  'Neo Soul', 'Boom Bap', 'Future Bass', 'Trap Soul', 'Post-Rock', 'Shoegaze',
  'Vaporwave', 'Bossa Nova', 'Trance'
];

const presetLores = [
  'An ancient monk chanting in a futuristic temple',
  'Cyberpunk monks meditating in a neon cityscape',
  'A ritual of light and shadow deep in the forest',
  'Celestial beings singing in a digital cathedral',
  'Battle hymn of a wandering monk-warrior',
];

const StudioClient = () => {
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

      const res = await fetch('/api/compose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          music_length_ms: 60000,
          output_format: 'mp3_44100_128',
        }),
      });

      if (!res.ok) throw new Error('Failed to generate song');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error generating music:', err.message);
        setError('Something went wrong while generating music.');
      } else {
        setError('Unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-amber-100 min-h-screen p-6 font-secondary bg-black">
      <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-amber-200 mb-4">
            🎧 Create Your Own MØNK Anthem
          </h1>
          <p className="text-sm md:text-base text-amber-300/80">
            Transform your lore into sound.
          </p>
          <p className="text-xs md:text-sm text-amber-400 mt-2">
            Choose an inspiration or write your own lore prompt below.
          </p>
        </div>
  
        <Stats>
          <div className="p-4 md:p-6 flex flex-col gap-4 text-amber-100">
            {!defaultLore && (
              <div className="mb-4 text-center">
                <CustomDiv text="Choose an Inspiration" className="text-center mb-3 mx-auto" />
                <div className="flex flex-wrap justify-center gap-2">
                  {presetLores.map((idea) => (
                    <button
                      key={idea}
                      onClick={() => setPrompt(idea)}
                      className="px-3 py-2 bg-gray-800 rounded text-xs hover:bg-gray-700 transition"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            )}
  
            <label className="block text-sm text-amber-200">Lore Prompt</label>
            <textarea
              className="w-full p-3 bg-gray-900 text-amber-100 rounded text-sm focus:ring-amber-400 focus:outline-none"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your monk's legend or story..."
            />
  
            <label className="block text-sm text-amber-200">Optional Lyrics</label>
            <textarea
              className="w-full p-3 bg-gray-900 text-amber-100 rounded text-sm focus:ring-amber-400 focus:outline-none"
              rows={2}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Add lyrics if you'd like..."
            />
  
            <label className="block text-sm text-amber-200">Music Style</label>
            <select
              className="w-full p-3 bg-gray-900 text-amber-100 rounded text-sm"
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
              disabled={loading || !prompt}
              className="mt-4 w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition disabled:opacity-50"
            >
              {loading ? 'Generating Anthem...' : 'Generate My MØNK Anthem'}
            </button>
  
            {error && <p className="text-red-400 mt-3">{error}</p>}
  
            {audioUrl && (
              <div className="mt-6 text-center">
                <CustomDiv text="Preview" className="mx-auto mb-3" />
                <audio controls src={audioUrl} className="w-full rounded-lg" />
                <a
                  href={audioUrl}
                  download={`monk-anthem-${Date.now()}.mp3`}
                  className="mt-3 inline-block px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
                >
                  ⬇️ Download Anthem
                </a>
              </div>
            )}
          </div>
        </Stats>
      </div>
    </div>
  );
}
  
export default StudioClient;
