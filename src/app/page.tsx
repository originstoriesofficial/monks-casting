/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface Metadata {
  attributes: any;
  description: string;
  external_url: string;
  image: string;
  name: string;
}

export default function CastingAI() {
  // RainbowKit wallet account
  const { address, isConnected } = useAccount();

  // State management
  const [tokenId, setTokenId] = useState('');
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [hasName, setHasName] = useState('no');
  const [breakdown, setBreakdown] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState({
    metadata: false,
    upscaling: false,
    generating: false
  });

  // Status message
  const [status, setStatus] = useState({
    message: '',
    type: '' as 'error' | 'success' | ''
  });

  const showStatus = (message: string, type: 'error' | 'success') => {
    setStatus({ message, type });
    setTimeout(() => setStatus({ message: '', type: '' }), 5000);
  };

  // Helper function to convert an ipfs:// URL to a gateway URL
  const convertIPFSToGatewayUrl = (ipfsUrl: string) => {
    if (ipfsUrl.startsWith("ipfs://")) {
      return ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return ipfsUrl;
  };

  const fetchMetadataAndUpscale = async () => {
    if (!tokenId) {
      showStatus("Please enter a valid Token ID.", "error");
      return;
    }
    
    // Ensure wallet is connected
    if (!isConnected || !address) {
      showStatus("Please connect your wallet.", "error");
      return;
    }

    setLoading(prev => ({ ...prev, metadata: true }));
    try {
      // First fetch metadata
      const metadataResponse = await fetch(`/api/metadata?tokenId=${tokenId}`);
      if (!metadataResponse.ok) throw new Error('Failed to fetch metadata');
      const metadataData = await metadataResponse.json();
      console.log(metadataData?.metadata)
      setMetadata(metadataData?.metadata);

      // Then upscale the image from metadata
      const imageUrl = metadataData?.metadata.image;
      if (!imageUrl) throw new Error('No image URL in metadata');

      // Convert IPFS URL to a gateway URL
      const gatewayUrl = convertIPFSToGatewayUrl(imageUrl);

      // Fetch the image file from the IPFS gateway
      const imageResponse = await fetch(gatewayUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image from IPFS gateway');
      }
      const blob = await imageResponse.blob();
      // Create a File object from the blob (adjust the filename and type as needed)
      const file = new File([blob], "image.png", { type: blob.type });

      setLoading(prev => ({ ...prev, upscaling: true }));

      // Prepare FormData with the file
      const formData = new FormData();
      formData.append("photo", file);
      // Use the wallet address as userId
      formData.append("userId", address);

      // Send the file to the upscale API
      const upscaleRes = await fetch("/api/upscale", {
        method: "POST",
        body: formData,
      });

      console.log(upscaleRes)

      if (!upscaleRes.ok) throw new Error('Failed to upscale image');
      const upscaleData = await upscaleRes.json();
      console.log(upscaleData)
      setUpscaledImage(upscaleData?.upscaledImageUrl);
      showStatus("Image upscaled successfully!", "success");

    } catch (error) {
      showStatus(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
      console.error("Error in process:", error);
    } finally {
      setLoading(prev => ({ ...prev, metadata: false, upscaling: false }));
    }
  };

  const generateCharacter = async () => {
    if (!upscaledImage || !metadata) {
      showStatus("Please complete the previous steps first.", "error");
      return;
    }

    setLoading(prev => ({ ...prev, generating: true }));
    try {
      // const formData = new FormData();
      // formData.append("visionAttributes", upscaledImage);
      // formData.append("blockchainAttributes", metadata?.attributes);

      const formData={
        visionAttributes: (upscaledImage),
        blockchainAttributes: (metadata?.attributes),
      }

      const response = await fetch("/api/generate-profile", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate character');
      const data = await response.json();
      setBreakdown(data.data);
      showStatus("Character generated successfully!", "success");
    } catch (error) {
      showStatus(
        error instanceof Error ? error.message : "Failed to generate character",
        "error"
      );
    } finally {
      setLoading(prev => ({ ...prev, generating: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10">
      {/* Navbar */}
      <nav className="w-full py-4 px-8 fixed top-0 z-50 bg-transparent">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* <img src="/images/logo.png" alt="Logo" className="w-10 h-auto" />
            <span className="ml-2 text-white font-bold text-lg">MØNKS Casting Studio</span> */}
          </div>
          <div>
            <ConnectButton showBalance={false} />
          </div>
        </div>
      </nav>

      {/* Main content container with top margin to account for navbar */}
      <div className="mt-20 w-full">
        {/* Header */}
        <header className="text-center mb-12 relative">
          <div className="flex justify-center">
            <img
              src="/images/castle.png"
              alt="Mystical Castle"
              className="floating-castle w-40 h-auto"
            />
          </div>
          <h1 className="text-6xl font-bold font-secondary shimmer-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-700 to-yellow-900">
            MØNKS Casting Studio
          </h1>
          <p className="mt-4 text-gray-300">
            Transform your character with AI-powered casting insights
          </p>
        </header>

        {/* Status Message */}
        {status.message && (
          <div
            className={`w-full max-w-xl mx-auto mb-6 p-4 rounded-lg ${
              status.type === 'error'
                ? 'bg-red-500/20 text-red-200 border border-red-500/50'
                : 'bg-green-500/20 text-green-200 border border-green-500/50'
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Token ID Input */}
        <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-primary">1️⃣ Enter Your MØNK Token ID</h2>
          <div className="w-full mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter MØNKS Token ID"
              className="flex-1 rounded-lg bg-background text-white px-4 py-3 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <button
              onClick={fetchMetadataAndUpscale}
              disabled={!tokenId || loading.metadata || loading.upscaling}
              className="px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading.metadata || loading.upscaling ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Fetch & Upscale"
              )}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        {upscaledImage && (
          <div className="w-full max-w-xl mx-auto mt-8">
            <h2 className="text-xl font-bold text-primary mb-4">2️⃣ Your Enhanced MØNK</h2>
            <div className="relative rounded-lg overflow-hidden border-2 border-primary/50">
              <img
                src={upscaledImage}
                alt="Upscaled Character Preview"
                className="w-128 h-128 object-cover"
           
              />
            </div>
          </div>
        )}

        {/* Character Details */}
        {upscaledImage && metadata && (
          <div className="w-full max-w-xl mx-auto mt-8">
            <h2 className="text-xl font-bold text-primary mb-4">3️⃣ Character Details</h2>
            <div className="space-y-4">
              <select
                value={hasName}
                onChange={(e) => setHasName(e.target.value)}
                className="w-full rounded-lg bg-gray-800/50 text-white px-4 py-3 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="no">Auto-generate character name</option>
                <option value="yes">I have a name in mind</option>
              </select>

              {hasName === "yes" && (
                <input
                  type="text"
                  placeholder="Enter Character Name"
                  className="w-full rounded-lg bg-gray-800/50 text-white px-4 py-3 border border-gray-700 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                />
              )}

              <button
                onClick={generateCharacter}
                disabled={loading.generating}
                className="w-full py-4 bg-yellow-800 text-white font-semibold rounded-lg  transition-all disabled:opacity-50"
              >
                {loading.generating ? (
                  <Loader className="animate-spin mx-auto" size={20} />
                ) : (
                  "Generate Character Breakdown"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Character Breakdown Display */}
        {breakdown && (
          <div className="w-full max-w-xl mx-auto mt-8 p-6 bg-gray-800/50 rounded-lg border border-primary/20">
            <h3 className="text-xl font-bold text-primary mb-4">Character Breakdown</h3>
            <div className="prose prose-invert max-w-none p-6 rounded-lg bg-gray-900 text-white shadow-lg border border-gray-700">
      <div className="space-y-4">
        {breakdown.split("\n\n").map((section, index) => (
          <p key={index} className="text-lg leading-relaxed">{section}</p>
        ))}
      </div>
    </div>
            {/* <div className="prose prose-invert max-w-none">{breakdown}</div> */}
          </div>
        )}
      </div>
    </div>
  );
}
