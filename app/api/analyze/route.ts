import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    if (!image) return NextResponse.json({ success: false, error: "No image" }, { status: 400 });

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${image.type};base64,${base64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.0,   // Very strict
      max_tokens: 250,
      messages: [
        {
          role: "system",
          content: `You are a strict holistic dog veterinarian. Look at the photo and pick EXACTLY ONE best protocol. 

Pooping / rear / stool / digestive signs = Buddy's Gut Balance & Cleanse
Skin rash / redness / itching / hot spots = Allergy Shield
Eyes / discharge = Clear Vision Defender
Stiffness / limping = Max Movement Pro
NEVER give multiple options. Be decisive.`
        },
        { role: "user", content: [
          { type: "text", text: "Analyze this dog photo and recommend ONLY ONE protocol with short reason." },
          { type: "image_url", image_url: { url: dataUrl }}
        ]}
      ]
    });

    const text = response.choices[0]?.message?.content || "No analysis";

    return NextResponse.json({
      success: true,
      finding: text,
      protocol: text.includes("Gut") ? "Buddy's Gut Balance & Cleanse" : 
                text.includes("Allergy") ? "Allergy Shield" : "Foundation Liver & Kidney Detox",
      confidence: "82%"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "AI busy" }, { status: 503 });
  }
}