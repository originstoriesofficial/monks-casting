'use client';
import React, { useState, useEffect } from 'react';

const INSPIRATIONS: string[] = [
  'An ancient monk chanting in a futuristic temple',
  'Cyberpunk monks meditating in a neon cityscape',
  'A ritual of light and shadow deep in the forest',
  'Celestial beings singing in a digital cathedral',
  'Battle hymn of a wandering monk-warrior',
  'Dreaming monks surrounded by bioluminescent lotuses',
  'A lone monk recording prophecies on holographic scrolls',
  'Sacred drums echoing in zero gravity',
  'Digital incense rising from crystal circuits',
  'Meditations inside a glass pyramid on Mars',
  'Voices of monks blending with alien harmonics',
  'A cosmic prayer carried by solar winds',
  'Ancient bells ringing through quantum dimensions',
  'Hooded monks guarding the library of forgotten code',
  'A monk orchestra channeling divine frequency',
  'Echoes of enlightenment across metallic mountains',
  'Ceremonial dance in a fractal monastery',
  'Oceanic chants from beneath the waves',
  'Stone monks awakening as living statues',
  'Etheric monks weaving light into melodies',
  'A parallel monastery at the edge of a black hole',
  'Spirit monks whispering through digital rain',
  'A luminous meditation inside a data temple',
  'Mechanical monks performing sacred code',
  'The awakening of the first digital monk',
  'A tranquil chant beneath floating monasteries',
  'Voices of monks dissolving into starlight',
  'Mystic resonance within the infinite void',
  'Prayers encrypted in shimmering sound waves',
  'Holographic monks forming constellations of faith',
];

export default function InspirationSelector() {
  const [currentSet, setCurrentSet] = useState<string[]>([]);

  useEffect(() => {
    rotateInspirations();
    const id = setInterval(rotateInspirations, 15000);
    return () => clearInterval(id);
  }, []);

  const rotateInspirations = (): void => {
    const shuffled = [...INSPIRATIONS].sort(() => 0.5 - Math.random());
    setCurrentSet(shuffled.slice(0, 5));
  };

  return (
    <div
      className="
        flex flex-col items-center justify-center
        w-full h-full min-h-[320px]
        px-6 py-8
        bg-black/60 rounded-lg
        border border-[#bfa36f]/40
        shadow-[0_0_30px_rgba(191,163,111,0.15)]
        overflow-hidden
      "
    >
      <h2 className="text-xl font-semibold mb-6 text-center text-[#e3d7b6] tracking-wide">
        Choose an Inspiration
      </h2>

      <div className="flex flex-col items-center justify-center gap-3 w-full">
        {currentSet.map((inspiration, i) => (
          <button
            key={i}
            type="button"
            onClick={rotateInspirations}
            className="
              bg-[#1c1f26] text-[#e3d7b6]
              px-5 py-3 rounded-md
              whitespace-normal text-center leading-snug
              max-w-[90%] md:max-w-[80%]
              hover:bg-[#3a3e47] transition-all duration-300
            "
          >
            {inspiration}
          </button>
        ))}
      </div>

      <button
        onClick={rotateInspirations}
        className="
          mt-6 text-sm text-[#bfa36f]
          hover:text-[#e3d7b6] transition-colors
        "
      >
        🔁 Shuffle Inspirations
      </button>
    </div>
  );
}
