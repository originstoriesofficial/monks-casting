import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { MongoClient } from "mongodb";

fal.config({
  credentials: process.env.FAL_AI_API_KEY!,
});

export async function generateCharacterBreakdown({
  visionAttributes,
  blockchainAttributes,
}: {
  visionAttributes: string;
  blockchainAttributes: any;
}): Promise<string> {
  const systemMessage = `
  You are a professional production company creating a character for an epic TV series.
  Given the blockchain attributes and vision analysis, generate a **Hollywood-style casting sheet** and a **character stat card**.

  🎭 **Mantle Monks Setting & Premise**:
  - A monastery caught in a **timeline split**, forced to navigate **modern hustle culture**.
  - Monks balancing **ancient wisdom with crypto, NFTs, and digital survival.**
  - Satirical, cinematic, and darkly humorous.

  🎭 **Character Breakdown**
  - **Character Name & Title**: (Auto-generate if missing)
  - **Appearance & Personality**: [From vision model]
  - **Mood & Aura**: [Vision analysis]
  - **Abilities & Power Level**: [Blockchain data]
  - **Hollywood Role Type**: Hero / Anti-hero / Mentor / Villain
  - **Strengths & Weaknesses**: (Make it cinematic & dramatic)
  - **Signature Moves & Combat Style**: (If applicable)
  - **Catchphrase / One-liner**: (Make it iconic)

  🎮 **Refined Character Stat Card**
  | **Stat**         | **Value** |
  |-----------------|----------|
  | **KARMA**        | [Zen / Hustler / Chaos] |
  | **GRIT**         | [Blockchain-based resilience level] |
  | **MANTRA POWER** | [Spiritual energy level] |
  | **COMBAT STYLE** | [Stylized Monk Blades, Energy-Infused Fists] |
  | **SIGNATURE RELIC** | [Custom Prayer Beads, Enchanted Scroll Holders] |

  Be witty, irreverent, sarcastic, and dry, capturing the tone of the "Mantle Monks" series.
  `; // ✅ FIXED Missing Backtick Here

  try {
    const result = await fal.subscribe("fal-ai/any-llm", {
      input: {
        model: "google/gemini-flash-1.5",
        system_prompt: systemMessage,
        prompt: JSON.stringify({ visionAttributes, blockchainAttributes }),
      },
    });

    const output = result.data?.output || "No response available.";
    console.log("✅ LLM Response:", output);

    // ✅ Save to MongoDB
    await saveCharacterToDB(visionAttributes, blockchainAttributes, output);

    return output;
  } catch (error) {
    console.error("❌ Error calling Any-LLM API:", error);
    return "Error generating character breakdown.";
  }
}

// ✅ Save Character Profile to MongoDB
async function saveCharacterToDB(visionAttributes: string, blockchainAttributes: any, characterBreakdown: string) {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not set in environment variables.");
    return;
  }

  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    const db = client.db("mantle_monks");
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
  } finally {
    await client.close();
  }
}
