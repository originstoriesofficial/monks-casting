import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { MongoClient } from "mongodb";

fal.config({
  credentials: process.env.FAL_AI_API_KEY!,
});

const client = new MongoClient(process.env.MONGODB_URI!);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const photo = formData.get("photo") as File;
  const userId = formData.get("userId") as string;

  if (!photo || !userId) {
    return NextResponse.json({ error: "Photo and user ID required" }, { status: 400 });
  }

  try {
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

    // Store in MongoDB
    const db = client.db("casting-db");
    await db.collection("upscaledImages").insertOne({ userId, imageUrl: upscaledImageUrl, createdAt: new Date() });

    return NextResponse.json({ upscaledImageUrl });
  } catch (error) {
    console.error("Error upscaling image:", error);
    return NextResponse.json({ error: "Failed to upscale image" }, { status: 500 });
  }
}
