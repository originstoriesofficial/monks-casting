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
}

// System prompt for character generation
const SYSTEM_MESSAGE = `
  You are a professional production company creating a character for an epic TV series.
  Given the blockchain attributes and vision analysis, generate a **Hollywood-style casting sheet** and a **character stat card**.

  🎭 **Mantle Monks Setting & Premise**:
  - A monastery caught in a **timeline split**, forced to navigate **modern hustle culture**.
  - Monks balancing **ancient wisdom with crypto, NFTs, and digital survival.**
  - Satirical, cinematic, and darkly humorous.

  🎭 **Character Breakdown**
  - **Character Name & Title**: (Auto-generate if missing)
  - **Abilities & Power Level**: {blockchainAttributes}
  - **Hollywood Role Type**: Hero / Anti-hero / Mentor / Villain
  - **Strengths & Weaknesses**: (Make it cinematic & dramatic)
  - **Signature Moves & Combat Style**: (If applicable)
  - **Catchphrase / One-liner**: (Make it iconic)

  🎮 **Refined Character Stat Card**
  | **Stat**         | **Value** |
  |-----------------|----------|
  | **KARMA**        | [Zen / Hustler / Chaos] |
  | **GRIT**         | {blockchainAttributes.gritLevel} |
  | **MANTRA POWER** | {blockchainAttributes.mantraPower} |
  | **COMBAT STYLE** | [Stylized Monk Blades, Energy-Infused Fists] |
  | **SIGNATURE RELIC** | [Custom Prayer Beads, Enchanted Scroll Holders] |

  Be witty, irreverent, sarcastic, and dry, capturing the tone of the "Mantle Monks" series.
`;

async function saveCharacterToDB(
  visionAttributes: string,
  blockchainAttributes: Record<string, any>,
  characterBreakdown: string
) {
  const mongoUri = process.env.MONGO_URI;
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


    const formattedBlockchainAttributes = body.blockchainAttributes.reduce(
      (acc: any, attr: any) => {
        acc[attr.trait_type] = attr.value;
        return acc;
      },
      {} as Record<string, any>
    );

    // Prepare dynamic system prompt with request data
    const dynamicSystemMessage = SYSTEM_MESSAGE
      .replace("{visionAttributes}", JSON.stringify(body.visionAttributes))
      .replace("{blockchainAttributes}", JSON.stringify(formattedBlockchainAttributes));

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
