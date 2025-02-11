/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const photo = formData.get('photo') as File;
  console.log(photo, 'get photo link')
  const characterName = formData.get('characterName') as string;
  const hasName = formData.get('hasName') as string;

  if (!photo) {
    return NextResponse.json({ error: 'Photo is required' }, { status: 400 });
  }

  // Simulate Vision Model Attributes
  const visionAttributes = await fakeVisionModel(photo);
  console.log(visionAttributes, 'visionAttributes')

  // Generate Character Breakdown using GPT or any LLM
  const breakdown = await generateCharacterBreakdown({
    visionAttributes,
    characterName,
    hasName,
  });

  return NextResponse.json({ breakdown });
}

// Simulated Vision Model Function
async function fakeVisionModel(photo: File): Promise<string> {
  console.log(photo.type, 'from vision model')
  const file = new File(["MonksCreativeUpscaler"], photo.name, { type: photo.type });
const url = await fal.storage.upload(file);

  const vision = 'Tall, confident, sharp-eyed individual with a commanding presence.'

  return vision;
}

// Simulated GPT-4/LLM Function
async function generateCharacterBreakdown({
  visionAttributes,
  characterName,
  hasName,
}: {
  visionAttributes: string;
  characterName: string;
  hasName: string;
}): Promise<string> {
  const nameSection = hasName === 'yes' ? `Name: ${characterName}` : 'Name: Not provided';
  return `
Character Breakdown
===================
${nameSection}
Vision Attributes: ${visionAttributes}

This character is perfect for roles requiring a mix of confidence and leadership.
`;
}
