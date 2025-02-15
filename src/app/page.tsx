'use client';
import React, { useState, ChangeEvent } from 'react';
import { Upload, Loader } from 'lucide-react';
import Image from 'next/image';
import Head from 'next/head';

export default function CastingAI() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [hasName, setHasName] = useState('no');
  const [breakdown, setBreakdown] = useState('');
  const [loading, setLoading] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!photo) {
      alert("Please upload a photo.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("userId", "test-user");

    try {
      const upscaleRes = await fetch("/api/upscale", {
        method: "POST",
        body: formData,
      });
      const upscaleData = await upscaleRes.json();
      setUpscaledImage(upscaleData.upscaledImageUrl);
    } catch (error) {
      console.error("Error upscaling image:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    if (!tokenId) {
      alert("Please enter a valid Token ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/metadata?tokenId=${tokenId}`);
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!upscaledImage) {
      alert("Please upload and upscale a photo first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("imageUrl", upscaledImage);
    formData.append("characterName", characterName);
    formData.append("hasName", hasName);
    formData.append("blockchainData", JSON.stringify(metadata));

    try {
      const response = await fetch("/api/generate-character", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setBreakdown(data.breakdown);
    } catch (error) {
      console.error("Error generating breakdown:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10">
      {/* Header with Floating Castle */}
      <header className="text-center mb-12 relative">
        <div className="flex justify-center">
          <img
            src="/images/castle.png"
            alt="Mystical Castle"
            className="floating-castle w-40 h-auto"
          />
        </div>
  
        <h1 className="text-6xl font-bold font-secondary shimmer-text">
          MØNKS Casting Studio
        </h1>
        <p className="mt-4 text-gray-300">
          Transform your character with AI-powered casting insights
        </p>
      </header>
  
      {/* Step 1️⃣: Polish Your MØNK */}
      <div className="w-full max-w-xl flex flex-col items-center text-center">
        <h2 className="text-xl font-bold text-yellow-500">1️⃣ Polish Your MØNK</h2>
        {upscaledImage ? (
          <Image
            src={upscaledImage}
            alt="Upscaled Character Preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-yellow-500/50"
            width={600}
            height={400}
          />
        ) : (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-primary text-black py-3 px-6 rounded-lg font-semibold transition-all duration-300 mt-4 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : "Upscale Your MØNK"}
          </button>
        )}
      </div>
  
      {/* Step 2️⃣: Summon Your Custom Aura */}
      <div className="w-full max-w-xl flex flex-col items-center text-center mt-8">
        <h2 className="text-xl font-bold text-yellow-500">2️⃣ Summon Your Custom Aura</h2>
        <input
          type="text"
          placeholder="Enter MØNKS Token ID on Mantle"
          className="mt-3 block w-full rounded-lg bg-gray-800 text-white px-4 py-2 focus:ring-2 focus:ring-yellow-900 focus:border-yellow-900 transition-colors text-center"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <button
          onClick={fetchMetadata}
          disabled={!tokenId || loading}
          className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 mt-3 disabled:opacity-50"
        >
          Submit Token ID
        </button>
      </div>
  
      {/* Step 3️⃣: Conjure Your Character Insights */}
      <div className="w-full max-w-xl flex flex-col items-center text-center mt-8">
        <h2 className="text-xl font-bold text-yellow-500">3️⃣ Conjure Your Character Insights</h2>
        <p className="text-gray-300 text-sm mt-2">Does your MØNK have a name?</p>
        <select
          value={hasName}
          onChange={(e) => setHasName(e.target.value)}
          className="mt-2 block w-full rounded-lg bg-gray-800 text-white px-4 py-2 focus:ring-2 focus:ring-yellow-900 focus:border-yellow-900 transition-colors"
        >
          <option value="no">No name yet</option>
          <option value="yes">I have a name</option>
        </select>
  
        {hasName === "yes" && (
          <input
            type="text"
            placeholder="Enter Character Name"
            className="mt-2 block w-full rounded-lg bg-gray-800 text-white px-4 py-2 focus:ring-2 focus:ring-yellow-900 focus:border-yellow-900 transition-colors text-center"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
          />
        )}
  
        <button
          onClick={handleSubmit}
          disabled={loading || !upscaledImage || !metadata}
          className="w-full bg-primary text-black py-3 px-6 rounded-lg font-semibold transition-all duration-300 mt-4 disabled:opacity-50"
        >
          {loading ? <Loader className="animate-spin" size={20} /> : "Create Your Character Breakdown"}
        </button>
      </div>
    </div>
  );
}