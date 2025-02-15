import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";

const RPC_URL = "https://rpc.mantle.xyz"; // Mantle RPC URL
const CONTRACT_ADDRESS = "0x38BeD286A1EbaB9BA4508A6aF3937A5458f03198"; // Mantle Monks Contract

// Define the contract ABI to fetch tokenURI
const ABI = [
  {
    constant: true,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "uri", type: "string" }],
    type: "function",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tokenId = searchParams.get("tokenId");

  if (!tokenId) {
    return NextResponse.json({ error: "Token ID required" }, { status: 400 });
  }

  try {
    // Connect to the Mantle blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    // Fetch the tokenURI (metadata URL) from the smart contract
    const tokenURI = await contract.tokenURI(tokenId);
    
    // Fetch metadata from the tokenURI (usually a JSON file)
    const metadataRes = await fetch(tokenURI);
    const metadata = await metadataRes.json();

    return NextResponse.json({ metadata });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 });
  }
}
