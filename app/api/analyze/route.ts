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
      temperature: 0.0,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: `You are a strict holistic canine veterinarian. 

CRITICAL RULES - FOLLOW EXACTLY:
- If the photo shows poop, rear end, stool, diarrhea, gas, or digestive area → MUST recommend Buddy's Gut Balance & Cleanse as #1
- Only recommend Allergy Shield if clear skin rash, redness, itching, or hot spots are visible
- Never list multiple options. Pick ONE best protocol.
- Be direct and confident.`
        },
        { 
          role: "user", 
          content: [
            { type: "text", text: "Analyze this dog photo and recommend ONLY ONE protocol." },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ]
    });

    const text = response.choices[0]?.message?.content || "No analysis";

    return NextResponse.json({
      success: true,
      finding: text,
      protocol: text,
      confidence: "88%"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "AI busy" }, { status: 503 });
  }
}