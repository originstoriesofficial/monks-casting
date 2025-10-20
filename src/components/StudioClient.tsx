'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Stats from '@/components/Stats';
import CustomDiv from '@/components/CustomDiv';

// 🎵 Available music styles
const styles = [
  'Electronic', 'Hip-Hop', 'Trap', 'Lo-fi', 'Jazz', 'Ambient', 'Synthwave',
  'Orchestral', 'Fantasy', 'Cyberpunk', 'Retro', 'Rock', 'Funk', 'Drill',
  'Dubstep', 'Techno', 'Industrial', 'Afrobeats', 'Pop', 'Ballad', 'Hardstyle',
  'Epic', 'Darkwave', 'R&B', 'Chillwave', 'Glitch', 'Punk', 'EDM', 'Metal',
  'Reggaeton', 'Acoustic', 'Minimal', 'Experimental', 'Dream Pop', 'Gospel',
  'Neo Soul', 'Boom Bap', 'Future Bass', 'Trap Soul', 'Post-Rock', 'Shoegaze',
  'Vaporwave', 'Bossa Nova', 'Trance',
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
      const fullPrompt = `${prompt} in the style of ${style}. ${lyrics ? 'Lyrics: ' + lyrics : ''}`;

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
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error generating music:', msg);
      setError('Something went wrong while generating music.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Stats>
        <div className="p-4 md:p-6 flex flex-col gap-4 text-amber-100">
          {/* Lore Prompt */}
          <label className="block text-sm text-amber-200 text-left">Lore Prompt</label>
          <textarea
            className="w-full p-3 bg-gray-900 text-amber-100 rounded text-sm focus:ring-amber-400 focus:outline-none"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your monk's legend or story..."
          />

          {/* Optional Lyrics */}
          <label className="block text-sm text-amber-200 text-left">Optional Lyrics</label>
          <textarea
            className="w-full p-3 bg-gray-900 text-amber-100 rounded text-sm focus:ring-amber-400 focus:outline-none"
            rows={2}
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Add lyrics if you'd like..."
          />

          {/* Music Style */}
          <label className="block text-sm text-amber-200 text-left">Music Style</label>
          <select
            className="w-full p-3 bg-gray-900 text-amber-100 rounded text-sm"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {styles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Generate Button */}
          <button
            onClick={generateSong}
            disabled={loading || !prompt}
            className="mt-4 w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition disabled:opacity-50"
          >
            {loading ? 'Generating Anthem...' : 'Generate My MØNK Anthem'}
          </button>

          {/* Error */}
          {error && <p className="text-red-400 mt-3">{error}</p>}

          {/* Audio Preview */}
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
  );
};

// ✅ Default export required for import to work
export default StudioClient;
