// app/api/upscale/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { MongoClient, Db } from "mongodb";

export const runtime = "nodejs"; // ✅ Edge → Node so SRV DNS works

fal.config({ credentials: process.env.FAL_AI_API_KEY! });

// ---- Mongo singleton (serverless-safe) ----
let client: MongoClient | undefined;
let db: Db | undefined;

// optionally set DB name via env; fallback to "monks"
const DB_NAME = process.env.MONGODB_DB || "monks";

async function getDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  // NEVER log secrets:
  // console.log(uri);  // ❌ remove this

  client = client ?? new MongoClient(uri);
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}
// -------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const photo = formData.get("photo") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!photo || !userId) {
      return NextResponse.json(
        { error: "Photo and userId are required" },
        { status: 400 }
      );
    }

    const imageUrl = await fal.storage.upload(photo);

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

    const upscaledImageUrl = result.data?.image?.url || imageUrl;

    const database = await getDb();
    await database.collection("upscaledImages").insertOne({
      userId,
      imageUrl: upscaledImageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({ upscaledImageUrl });
  } catch (err: any) {
    console.error("Error upscaling image:", err);
    return NextResponse.json(
      { error: err?.message || "Error in upscaling" },
      { status: 500 }
    );
  }
}
