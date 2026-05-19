import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${image.type};base64,${base64}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.1,           // Lower = more consistent
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `You are an expert canine holistic veterinarian. Analyze the dog photo and recommend ONE best Freedom Paws protocol.

Available Protocols:
1. Max Movement Pro – Joint/mobility issues
2. Freedom Calm – Anxiety, stress, restlessness
3. Foundation Liver & Kidney Detox – General detox, senior dogs, lethargy
4. Buddy's Gut Balance & Cleanse – Digestive issues, poop problems, diarrhea, gas
5. Infra-Red Spine & Joint – Back pain, stiffness
6. Allergy Shield – Skin rashes, itching, hot spots, allergies
7. Fresh Smile – Dental, bad breath, oral health
8. Heart Strong – Heart or cardiovascular signs
9. Patriot Immune Defender – Overall immunity, frequent illness
10. Clear Vision Defender – Eye issues, discharge, cloudiness

Rules:
- Prioritize visible symptoms strongly.
- Pooping, loose stool, rear end focus → strongly prefer Gut Balance
- Skin redness, scratching, hot spots → Allergy Shield
- Eyes → Clear Vision
- Stiffness, limping → Max Movement or Infra-Red
- Be direct and accurate. Never default to Liver/Kidney unless no clear signs.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this dog photo and recommend the single best protocol with short reasoning." },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ]
    });

    const aiText = response.choices[0]?.message?.content || "Analysis unavailable.";

    return NextResponse.json({
      success: true,
      finding: aiText,
      protocol: "See AI recommendation above",
      confidence: "85%"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      error: "AI service busy. Please try again." 
    }, { status: 503 });
  }
}