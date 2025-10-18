// app/api/upscale/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { MongoClient, Db } from "mongodb";

export const runtime = "nodejs"; // Use Node runtime (Edge can't resolve mongodb+srv SRV records)

// ---- FAL config ----
fal.config({ credentials: process.env.FAL_AI_API_KEY! });

// ---- Mongo singleton (serverless-safe) ----
let _client: MongoClient | undefined;
let _db: Db | undefined;

const DB_NAME = process.env.MONGODB_DB || "monks";

async function getDb(): Promise<Db> {
  if (_db) return _db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  // Do NOT log the URI; treat it as secret.
  _client = _client ?? new MongoClient(uri);
  await _client.connect();
  _db = _client.db(DB_NAME);
  return _db;
}

// ---- Handler ----
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const photo = formData.get("photo");
    const userId = formData.get("userId");

    if (!(photo instanceof File) || typeof userId !== "string" || userId.length === 0) {
      return NextResponse.json(
        { error: "Photo (File) and userId (string) are required" },
        { status: 400 }
      );
    }

    // Upload to FAL storage
    const imageUrl = await fal.storage.upload(photo);

    // Run upscaler
    const result = await fal.subscribe("fal-ai/clarity-upscaler", {
      input: {
        image_url: imageUrl,
        upscale_factor: 2,
        creativity: 0.35,
        resemblance: 0.6,
        guidance_scale: 4,
        num_inference_steps: 18,
      },
      logs: true,
    });

    const upscaledImageUrl =
      (result as { data?: { image?: { url?: string } } })?.data?.image?.url || imageUrl;

    // Persist in Mongo
    const db = await getDb();
    await db.collection("upscaledImages").insertOne({
      userId,
      imageUrl: upscaledImageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({ upscaledImageUrl }, { status: 200 });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error upscaling image:", error);
    return NextResponse.json(
      { error: error.message || "Error in upscaling" },
      { status: 500 }
    );
  }
}
