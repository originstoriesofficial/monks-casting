import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_AI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const { upscaledImageUrl } = await req.json();

  if (!upscaledImageUrl) {
    return NextResponse.json({ error: "Upscaled image URL required" }, { status: 400 });
  }

  try {
    const visionAttributes = await fal.subscribe("fal-ai/florence-2-large/detailed-caption", {
      input: { image_url: upscaledImageUrl },
      logs: true,
    });

    return NextResponse.json({ visionAttributes });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
