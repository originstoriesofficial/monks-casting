/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/character/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { MongoClient } from "mongodb";
import { ethers } from "ethers";

// Initialize FAL AI client
fal.config({
  credentials: process.env.FAL_AI_API_KEY!,
});

// ABI fragments
const ERC721_METADATA_ABI = [
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const ERC721_BALANCE_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Type definitions
interface RequestBody {
  visionAttributes: string;
  tokenId: string | number;
  name: string;
  walletAddress?: string; // Optional wallet address to check for HP calculation
}

interface BlockchainAttribute {
  trait_type: string;
  value: string | number;
}

interface CharacterResponse {
  name: string;
  roleType: string;
  signatureMove: string;
  catchphrase: string;
  hp: number;
  statCard: {
    karma: string;
    grit: string;
    mantraPower: string;
    hustleSkill: string;
    signatureRelic: string;
  };
  strengths: string[];
  weaknesses: string[];
}

// Updated system prompt with more explicit formatting instructions
const SYSTEM_MESSAGE = `
You are generating a character for **"Mønkks"** — an animated show set in a mystical monastery that’s been forced to pay rent after a timeline split. Think: Xavier’s School meets Kung Fu monks meets absurdist sitcom.

The monastery is home to 350 monks from all over the world, each with unique vibes, skills, flaws, and philosophies. The series blends Eastern wisdom, meme culture, and absurd comedy with musical numbers and found footage from the real world.

Use the blockchain traits and vision input to create a **distinct character** with personality, purpose, and flavor — not just a stat sheet.

---

### 🎭 FORMAT (Valid JSON inside a code block)

\`\`\`json
{
  "name": "{name}",
  "roleType": "Hero / Sidekick / Mentor / Villain / NPC / Wildcard",
  "signatureMove": "A signature action, move, or quote-worthy behavior (funny, philosophical, or weird)",
  "catchphrase": "A line this monk repeats often — can be ironic, poetic, or spiritual",
  "hp": {hp},
  "statCard": {
    "karma": "Zen / Hustler / Agent of Chaos / Balanced / Blissed Out / Burnt Out",
    "grit": "Fleeting / Solid / Legendary / Measured / Iconic / Scatterbrained",
    "mantraPower": "Use the {color} energy and the {animal} spirit to describe a mystical or emotional ability",
    "hustleSkill": "Cooking / Singing / Scamming / Meditating / Inventing / Podcasting / App Building / Code / Gardening / etc",
    "signatureRelic": "A symbolic item they carry — can be odd, magical, or mundane"
  },
  "strengths": [
    "Emotional resilience",
    "Singing under pressure",
    "Tech tinkering"
  ],
  "weaknesses": [
    "Capitalist delusion",
    "Fear of stillness",
    "Imposter syndrome"
  ]
}
\`\`\`

---

### 🧠 Lore Guidelines

- The characters don’t need to **know** blockchain — they’re just reacting to the world.
- Some monks are old-world, some are overly online.
- Many are trying to make rent by pitching projects (e.g., “Only Hands”, AI meditation app, k-pop side gigs).
- Strengths/Weaknesses should be more **human** or **thematic** — not crypto jargon.
- Signature Moves can be **musical**, **found footage-inspired**, **food-related**, or **bizarrely powerful**.

---

Think like a show writer, not a stat generator. These are monks with personalities, contradictions, and secret pasts — ready for a food fight, a TED Talk, or a talent show.
`;

// Function to fetch token metadata from Mantle blockchain
async function fetchTokenMetadata(tokenId: string | number): Promise<BlockchainAttribute[]> {
  try {
    const contractAddress = "0x38BeD286A1EbaB9BA4508A6aF3937A5458f03198";
    const mantleRpcUrl = process.env.MANTLE_RPC_URL || "https://rpc.mantle.xyz";
    
    // Connect to Mantle blockchain
    const provider = new ethers.JsonRpcProvider(mantleRpcUrl);
    const contract = new ethers.Contract(contractAddress, ERC721_METADATA_ABI, provider);
    
    // Fetch token URI
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(`Token URI for token ${tokenId}: ${tokenURI}`);
    
    // If tokenURI is ipfs:// format, convert to HTTP URL
    let metadataUrl = tokenURI;
    if (tokenURI.startsWith("ipfs://")) {
      metadataUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    
    // Fetch metadata from the URI
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch token metadata: ${response.statusText}`);
    }
    
    const metadata = await response.json();
    console.log(`Metadata for token ${tokenId}:`, metadata);
    
    // Return the attributes array from the metadata
    if (Array.isArray(metadata.attributes)) {
      return metadata.attributes;
    } else {
      // If attributes aren't in expected format, create a fallback
      return [
        { trait_type: "Animal", value: metadata.animal || "Unknown" },
        { trait_type: "Color", value: metadata.color || metadata.capeColor || "Unknown" },
        { trait_type: "Attribute", value: metadata.attribute || "Unknown" }
      ];
    }
  } catch (error) {
    console.error("Error fetching token metadata:", error);
    // Return fallback attributes if fetch fails
    return [
      { trait_type: "Animal", value: "Unknown" },
      { trait_type: "Color", value: "Unknown" },
      { trait_type: "Attribute", value: "Unknown" }
    ];
  }
}

// Function to check wallet balance and calculate HP
async function calculateHP(walletAddress: string): Promise<number> {
  try {
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return 100; // Default HP if no valid wallet provided
    }

    const contractAddress = "0x38BeD286A1EbaB9BA4508A6aF3937A5458f03198";
    const mantleRpcUrl = process.env.MANTLE_RPC_URL || "https://rpc.mantle.xyz";
    
    // Connect to Mantle blockchain
    const provider = new ethers.JsonRpcProvider(mantleRpcUrl);
    const contract = new ethers.Contract(contractAddress, ERC721_BALANCE_ABI, provider);
    
    // Check how many tokens the wallet holds
    const balance = await contract.balanceOf(walletAddress);
    
    // Calculate HP: 20 per token
    const hp = Number(balance) * 20;
    
    return hp > 0 ? hp : 100; // Minimum HP of 100
  } catch (error) {
    console.error("Error calculating HP from wallet:", error);
    return 100; // Default to 100 HP if there's an error
  }
}

// async function saveCharacterToDB(
//   tokenId: string | number,
//   visionAttributes: string,
//   blockchainAttributes: Record<string, any>,
//   characterData: CharacterResponse,
//   hp: number
// ) {
//   const mongoUri = process.env.MONGODB_URI;
//   if (!mongoUri) {
//     throw new Error("MONGODB_URI is not set in environment variables.");
//   }

//   const client = new MongoClient(mongoUri);
//   try {
//     await client.connect();
//     const db = client.db("Cluster0");
//     const collection = db.collection("characters");

//     const mongoData = {
//       tokenId,
//       visionAttributes,
//       blockchainAttributes,
//       characterData,
//       hp,
//       createdAt: new Date(),
//     };

//     await collection.insertOne(mongoData);
//     console.log("✅ Character saved to MongoDB");
//   } catch (error) {
//     console.error("❌ Error saving character to MongoDB:", error);
//     throw error;
//   } finally {
//     await client.close();
//   }
// }

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);
    const body = JSON.parse(rawBody) as RequestBody;
    console.log(body, 'log Body')

    // Validate required fields
    // if (!body.tokenId) {
    //   return NextResponse.json(
    //     { success: false, error: "Missing tokenId in request" },
    //     { status: 400 }
    //   );
    // }

    // Fetch blockchain attributes from token
    const blockchainAttributesArray = await fetchTokenMetadata(body.tokenId);
    
    // Format blockchain attributes into an object
    const formattedBlockchainAttributes = blockchainAttributesArray.reduce(
      (acc, attr) => {
        acc[attr.trait_type] = attr.value;
        return acc;
      },
      {} as Record<string, any>
    );

    console.log("Formatted blockchain attributes:", formattedBlockchainAttributes);

    // Extract specific attributes for customization
    const color = formattedBlockchainAttributes["Color"] || 
                 formattedBlockchainAttributes["color"] || 
                 formattedBlockchainAttributes["Cape Color"] || 
                 "Unknown";
                 
    const animal = formattedBlockchainAttributes["Animal"] || 
                  formattedBlockchainAttributes["animal"] || 
                  "Unknown";

    // Calculate HP based on wallet balance
    const hp = body.walletAddress 
      ? await calculateHP(body.walletAddress) 
      : 100; // Default HP if no wallet provided

    // Prepare dynamic system prompt with request data
    const dynamicSystemMessage = SYSTEM_MESSAGE
      .replace("{name}", body.name)
      .replace("{hp}", hp.toString())
      .replace("{color}", color)
      .replace("{animal}", animal);

    console.log("Dynamic system message:", dynamicSystemMessage);

      console.log("Dynamic system messages:", dynamicSystemMessage);

    // Generate character using FAL AI
    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "google/gemini-flash-2.5",
        system_prompt: dynamicSystemMessage,
        prompt: JSON.stringify({
          visionAttributes: body.visionAttributes,
          blockchainAttributes: formattedBlockchainAttributes,
          name: body.name,
          tokenId: body.tokenId,
          hp: hp
        }),
      },
    });

    const output = result.data?.output || "No response available.";
    console.log("FAL AI output:", output);
    
    // Try to parse the output as JSON
    let characterData: CharacterResponse;
    try {
      // Extract JSON from the markdown code block if present
      const jsonMatch = output.match(/```json\n([\s\S]*?)\n```/);
      characterData = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(output);
    } catch (e) {
      console.warn("Could not parse character output as JSON:", e);
      // Use a fallback structure if parsing fails
      characterData = {
        name: body.name,
        roleType: "NPC",
        signatureMove: "Default Move",
        catchphrase: "Default Catchphrase",
        hp: hp,
        statCard: {
          karma: "Zen",
          grit: "Medium",
          mantraPower: `${color} ${animal} Energy`,
          hustleSkill: "Street",
          signatureRelic: "Default Relic"
        },
        strengths: ["Default strength"],
        weaknesses: ["Default weakness"]
      };
    }

    // Save to MongoDB
    // await saveCharacterToDB(
      // body.tokenId,
      // body.visionAttributes,
      // formattedBlockchainAttributes,
      // characterData,
      // hp
    // );

    // Return success response with properly formatted character data
    return NextResponse.json(
      {
        success: true,
        data: output,
        tokenMetadata: {
          tokenId: body.tokenId,
          animal: animal,
          color: color,
          attributes: formattedBlockchainAttributes
        },
        hp: hp
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in character generation:", error);

    // Return appropriate error response
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}