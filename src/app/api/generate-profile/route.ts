/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/character/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { MongoClient } from "mongodb";

// Initialize FAL AI client
fal.config({
  credentials: process.env.FAL_AI_API_KEY!,
});

// Type definitions
interface RequestBody {
  visionAttributes: string;
  blockchainAttributes: any;
  name: string;
}

// System prompt for character generation
const SYSTEM_MESSAGE = `
  You are a professional production company creating a character for a TV series that blends ancient monastery culture with modern technology. 
  Given the blockchain attributes and vision analysis,
  (here you need to pass the attributes from the token id)
  generate a Hollywood-style casting sheet and a character stat card.

  Mantle Monks Setting & Premise:
  - A monastery caught in a timeline split is forced to navigate modern hustle culture in their quest to pay rent.
  - Monks balancing ancient wisdom with emerging tech (like crypto, AI, blockchain, XR, and digital survival).
  - Satirical, cinematic, and darkly humorous.

  🎭 Character Breakdown
  - Character Name: {name}
  - Hollywood Role Type: Sidekick / Hero / Anti-hero / Mentor / Villain / NPC, etc.
  - Signature Move
  - Catchphrase / One-liner: (Make it iconic)
  - Strengths & Weaknesses: (Make it cinematic & dramatic)
  
  🔮 Character Attributes
  - Vision Attributes: {visionAttributes}
  - Blockchain Attributes: {blockchainAttributes}

  🎮 Refined Character Stat Card
  | Stat         | Value |
  |-----------------|----------|
  | KARMA        | [Zen / Hustler / Chaos] |
  | GRIT         | [High / Low / Medium / Undetectable / Iconic / Legendary / Fleeting] |
  | MANTRA POWER | Combine the energy of the color {color} with the spirit of the animal {animal} to create a unique Mantra Power of no more than three words. |
  | HUSTLE SKILL | [Street, Dynasty, White Collar, Shady, Red Tape, etc.] |
  | SIGNATURE RELIC | [What they are holding in their hand in the contract] |

  Be witty, irreverent, sarcastic, and dry, capturing the tone of the "Mantle Monks" series.
`;

async function saveCharacterToDB(
  visionAttributes: string,
  blockchainAttributes: Record<string, any>,
  characterBreakdown: string
) {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables.");
  }

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db("casting-db");
    const collection = db.collection("characters");

    const characterData = {
      visionAttributes,
      blockchainAttributes,
      characterBreakdown,
      createdAt: new Date(),
    };

    await collection.insertOne(characterData);
    console.log("✅ Character saved to MongoDB");
  } catch (error) {
    console.error("❌ Error saving character to MongoDB:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const rawBody = await request.text();
    console.log("Raw request body:", rawBody);
    const body = JSON.parse(rawBody) as RequestBody;

    const formattedBlockchainAttributes = body.blockchainAttributes?.reduce(
      (acc: any, attr: any) => {
        acc[attr.trait_type] = attr.value;
        return acc;
      },
      {} as Record<string, any>
    );

    // Extract specific attributes for customization
    const color = formattedBlockchainAttributes["Color"] || "Unknown";
    const animal = formattedBlockchainAttributes["Animal"] || "Unknown";

    // Prepare dynamic system prompt with request data
    const dynamicSystemMessage = SYSTEM_MESSAGE
      .replace("{name}", body.name)
      .replace("{visionAttributes}", JSON.stringify(body.visionAttributes))
      .replace("{blockchainAttributes}", JSON.stringify(formattedBlockchainAttributes))
      .replace("{color}", color)
      .replace("{animal}", animal);

    // Generate character using FAL AI
    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "google/gemini-flash-1.5",
        system_prompt: dynamicSystemMessage,
        prompt: JSON.stringify(body),
      },
    });

    const output = result.data?.output || "No response available.";

    // Save to MongoDB
    await saveCharacterToDB(
      body.visionAttributes,
      body.blockchainAttributes,
      output
    );

    // Return success response
    return NextResponse.json(
      {
        success: true,
        data: output
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
