'use client';

import React, { useState } from 'react';
import { WORD_BANK } from '@/constants/wordBank';
import CustomMonkButton from '@/components/CustomMonkButton';

export default function WorldStudioPage() {
  const [country, setCountry] = useState<string | null>(null);
  const [animal, setAnimal] = useState('');
  const [clothing, setClothing] = useState('');
  const [lore, setLore] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const buildPrompt = () => {
    return `An editorial photograph of an animated ${animal}, wearing a traditional ${clothing}, channeling the spirit of ${lore}, ${country?.toLowerCase()} style, glossy, award-winning, 4k, symmetrical, crisp`;
  };

  const handleGenerate = async () => {
    const prompt = buildPrompt();
    setLoading(true);
    setImageUrl(null);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setImageUrl(data?.imageUrl);
    } catch (e) {
      console.error(e);
      alert('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#e3d7b6] py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-6">MØNKS / World Studio</h1>

      {/* Step 1: Choose Country */}
      <div className="mb-8 text-center">
        <h2 className="text-xl mb-2">Step 1: Choose a country</h2>
        <div className="flex justify-center flex-wrap gap-4">
          {Object.keys(WORD_BANK).map((c) => (
            <button
              key={c}
              className={`px-4 py-2 rounded border ${
                country === c ? 'bg-amber-600' : 'bg-[#1a1208]'
              }`}
              onClick={() => {
                setCountry(c);
                setAnimal('');
                setClothing('');
                setLore('');
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {country && (
        <>
          {/* Step 2: Choose Animal */}
          <div className="mb-6">
            <h2 className="text-lg mb-1">Choose an Animal</h2>
            <div className="flex flex-wrap gap-2">
              {WORD_BANK[country].animals.map((a) => (
                <button
                  key={a}
                  className={`px-3 py-1 border text-sm rounded ${
                    animal === a ? 'bg-amber-700' : 'bg-[#1a1208]'
                  }`}
                  onClick={() => setAnimal(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Choose Clothing */}
          <div className="mb-6">
            <h2 className="text-lg mb-1">Choose Clothing</h2>
            <div className="flex flex-wrap gap-2">
              {WORD_BANK[country].clothing.map((c) => (
                <button
                  key={c}
                  className={`px-3 py-1 border text-sm rounded ${
                    clothing === c ? 'bg-amber-700' : 'bg-[#1a1208]'
                  }`}
                  onClick={() => setClothing(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Choose Lore */}
          <div className="mb-6">
            <h2 className="text-lg mb-1">Choose Symbol or Lore</h2>
            <div className="flex flex-wrap gap-2">
              {WORD_BANK[country].lore.map((l) => (
                <button
                  key={l}
                  className={`px-3 py-1 border text-sm rounded ${
                    lore === l ? 'bg-amber-700' : 'bg-[#1a1208]'
                  }`}
                  onClick={() => setLore(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mt-8">
            <CustomMonkButton
              onClick={handleGenerate}
              text={loading ? 'Generating...' : 'Generate Monk'}
              disabled={!animal || !clothing || !lore || loading}
            />
          </div>

          {/* Output */}
          {imageUrl && (
            <div className="mt-10 text-center">
              <img
                src={imageUrl}
                alt="Generated Monk"
                className="w-full max-w-md mx-auto rounded border border-amber-600"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
