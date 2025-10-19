/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import MonksCastingStudio from "@/components/MonksCastingStudio";
import { MonksCastingNavbar } from "@/components/MonksCastingNavbar";
import CustomMonkButton from "@/components/CustomMonkButton";
import CustomMonkInput from "@/components/CustomInput";
import CharacterPage from "@/components/CharacterBreakdown";
import { checkOwnership } from "@/lib/contract";

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
  const [tokenId, setTokenId] = useState("");
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [characterName, setCharacterName] = useState("");
  const [breakdown, setBreakdown] = useState("");
  const [currentStep, setCurrentStep] = useState<
    "input" | "image" | "details" | "breakdown"
  >("input");

  // Loading states
  const [loading, setLoading] = useState({
    metadata: false,
    upscaling: false,
    generating: false,
  });

  // Status message
  const [status, setStatus] = useState({
    message: "",
    type: "" as "error" | "success" | "",
  });

  const showStatus = (message: string, type: "error" | "success") => {
    setStatus({ message, type });
    setTimeout(() => setStatus({ message: "", type: "" }), 5000);
  };

  useEffect(() => {
      const trackPoints = async () => {
        try {
          const response = await fetch("https://playground-s7c9.onrender.com/stack/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_name: "connect wallet",
              points: 1,
              account: address,
            }),
          });
      
          const result = await response.json();
          console.log("Tracking response:", result);
        } catch (error) {
          console.error("Error tracking points:", error);
        }
      };
  
      if (isConnected && address) {
        trackPoints();
      }
    }, [isConnected, address]);



  // Helper function to convert an ipfs:// URL to a gateway URL
  const convertIPFSToGatewayUrl = (ipfsUrl: string) => {
    if (ipfsUrl.startsWith("ipfs://")) {
      return ipfsUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
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

    const isOwner = await checkOwnership(tokenId, address);
    if (!isOwner) {
      showStatus("You are not the owner of this token.", "error");
      return;
    }

    setLoading((prev) => ({ ...prev, metadata: true }));
    try {
      // First fetch metadata
      const metadataResponse = await fetch(`/api/metadata?tokenId=${tokenId}`);
      if (!metadataResponse.ok) throw new Error("Failed to fetch metadata");
      const metadataData = await metadataResponse.json();
      setMetadata(metadataData?.metadata);

      // Then upscale the image from metadata
      const imageUrl = metadataData?.metadata.image;
      if (!imageUrl) throw new Error("No image URL in metadata");

      // Convert IPFS URL to a gateway URL
      const gatewayUrl = convertIPFSToGatewayUrl(imageUrl);

      // Fetch the image file from the IPFS gateway
      const imageResponse = await fetch(gatewayUrl);
      if (!imageResponse.ok) {
        throw new Error("Failed to fetch image from IPFS gateway");
      }
      const blob = await imageResponse.blob();
      // Create a File object from the blob (adjust the filename and type as needed)
      const file = new File([blob], "image.png", { type: blob.type });

      setLoading((prev) => ({ ...prev, upscaling: true }));

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

      if (!upscaleRes.ok) throw new Error("Failed to upscale image");
      const upscaleData = await upscaleRes.json();
      setUpscaledImage(upscaleData?.upscaledImageUrl);
      setCurrentStep("image");
      showStatus("Image upscaled successfully!", "success");
    } catch (error) {
      showStatus(
        error instanceof Error ? error.message : "An error occurred",
        "error"
      );
      console.error("Error in process:", error);
    } finally {
      setLoading((prev) => ({ ...prev, metadata: false, upscaling: false }));
    }
  };

  const generateCharacter = async () => {
    if (!upscaledImage || !metadata) {
      showStatus("Please complete the previous steps first.", "error");
      return;
    }

    setLoading((prev) => ({ ...prev, generating: true }));
    try {
      const formData = {
        visionAttributes: upscaledImage,
        blockchainAttributes: metadata?.attributes,
        name:characterName,
        tokenId: 332
      };

      console.log({formData})

      const response = await fetch("/api/generate-profile", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to generate character");
      const data = await response.json();
      console.log({data}, 'page.tsx data')
      setBreakdown(data);
      setCurrentStep("breakdown");
      showStatus("Character generated successfully!", "success");
    } catch (error) {
      showStatus(
        error instanceof Error ? error.message : "Failed to generate character",
        "error"
      );
    } finally {
      setLoading((prev) => ({ ...prev, generating: false }));
    }
  };

  const handleBack = () => {
    if (currentStep === "breakdown") {
      setCurrentStep("details");
    } else if (currentStep === "details") {
      setCurrentStep("image");
    } else if (currentStep === "image") {
      setCurrentStep("input");
    }
  };

  // Render the appropriate content based on the current step
  console.log({breakdown})
  const renderContent = () => {
    if(!isConnected){
      return <div>Please connect your wallet to proceed.</div>
    }else{
      switch (currentStep) {
        case "input":
          return (
            <MonksCastingStudio
              step="input"
              tokenId={tokenId}
              setTokenId={setTokenId}
              onSubmit={fetchMetadataAndUpscale}
              loading={loading.metadata || loading.upscaling}
            />
          );
  
        case "image":
          return (
            <div className="space-y-6">
              <MonksCastingStudio step="image" upscaledImage={upscaledImage} />
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep("details")}
                  className="px-4 py-2  text-secondary bg-primary rounded-lg hover:bg-amber-700"
                >
                  Continue
                </button>
              </div>
            </div>
          );
  
        case "details":
          return (
            <div className="space-y-6">
              <MonksCastingStudio step="details">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Image */}
                  {upscaledImage && (
                    <img
                      src={upscaledImage}
                      alt="Upscaled Character"
                      className="w-[80%] mx-auto rounded-lg border border-amber-200/50"
                    />
                  )}
  
                  {/* Input fields positioned over the image */}
                  <div className="absolute top-1/2 left-1/2 w-[90%] transform -translate-x-1/2 -translate-y-1/2 p-4 flex flex-col items-center space-y-4  rounded-lg shadow-lg">
                  
  
                    <CustomMonkInput
                      type="text"
                      placeholder="Enter Monk Name"
                      className="w-[80%] rounded-lg !text-[#D6C5AC] !font-secondary px-4 py-3  text-center"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                    />
  
                    <CustomMonkButton
                      onClick={generateCharacter}
                      disabled={loading.generating}
                      className="px-8 py-4 w-full max-w-[300px] font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      text={
                        loading.generating
                          ? "Generating..."
                          : "Create Lore"
                      }
                      textClassName=" font-secondary text-[#D6C5AC] whitespace-nowrap"
                    />
                  </div>
                </div>
              </MonksCastingStudio>
  
              {/* Back Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
              </div>
            </div>
          );
  
        case "breakdown":
          return (
            <div className="space-y-6">
              {CharacterPage(breakdown,upscaledImage!)}
              <div className="flex justify-center">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Back
                </button>
              </div>
            </div>
          );
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-4 py-10 ">
      {/* Custom Navbar */}
      <MonksCastingNavbar />

      {/* Status Message */}
      {status.message && (
        <div
          className={`w-full max-w-xl mx-auto mb-6 p-4 rounded-lg ${
            status.type === "error"
              ? "bg-red-500/20 text-red-200 border border-red-500/50"
              : "bg-green-500/20 text-green-200 border border-green-500/50"
          }`}
        >
          {status.message}
        </div>
      )}
    

      {renderContent()}
    </div>
  );
}
