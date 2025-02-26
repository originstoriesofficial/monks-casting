import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { Db, MongoClient } from "mongodb";


// Initialize MongoDB Client outside the handler to avoid reconnecting on every request


let db: Db;

const connectToDB = async () => {
  if (!db) {
    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error("MONGO_URI is not set in environment variables.");
      }
      console.log(mongoUri)
      const client = new MongoClient(mongoUri);
      await client.connect();
      db = client.db("casting-db"); // Set the database instance
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw new Error("Failed to connect to MongoDB");
    }
  }
  return db;
};

fal.config({
  credentials: process.env.FAL_AI_API_KEY!,
});

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

    // Connect to DB and insert the data
    const db = await connectToDB();
    await db.collection("upscaledImages").insertOne({
      userId,
      imageUrl: upscaledImageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({ upscaledImageUrl });
  } catch (error) {
    console.error("Error upscaling image:", error);
    return NextResponse.json({ error: (error as Error).message || "Error in upscaling" }, { status: 500 });
  }
}
