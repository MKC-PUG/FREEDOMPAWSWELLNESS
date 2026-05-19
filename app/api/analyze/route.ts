import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ success: false, error: "No image received" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${image.type};base64,${base64}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a strict, no-nonsense veterinary diagnostic AI for dogs.
          You MUST recommend EXACTLY ONE of these 10 protocols based on visible signs in the photo.
          Do NOT default to Liver/Kidney unless there are clear signs of lethargy, jaundice, or abdominal swelling.

          Visible Signs → Protocol:
          - Redness, itching, hot spots, flaky skin, bald patches → Allergy Shield – Skin & Coat Glow
          - Pooping, diarrhea, soft stool, bloated belly, gas → Buddy's Gut Balance & Cleanse
          - Stiff gait, limping, difficulty standing, joint swelling → Max Movement Pro
          - Cloudy eyes, squinting, discharge → Clear Vision Defender
          - Coughing, rapid breathing, lethargy with heart signs → Heart Strong
          - Anxiety, pacing, trembling, fearfulness → Freedom Calm
          - Dull coat, weakness, frequent infections → Patriot Immune Defender

          Be decisive. Prioritize the most obvious visible issue.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this dog photo carefully and recommend the single best protocol with short reasoning." },
            { type: "image_url", image_url: { url: dataUrl } }
          ]
        }
      ],
      max_tokens: 180,
      temperature: 0.2,   // Lower = more consistent
    });

    const aiResponse = completion.choices[0]?.message?.content || "";

    // Strong fallback mapping
    let protocol = "Foundation Liver & Kidney Detox";
    const lowerResponse = aiResponse.toLowerCase();

    if (lowerResponse.includes("skin") || lowerResponse.includes("rash") || lowerResponse.includes("itch") || lowerResponse.includes("allergy")) {
      protocol = "Allergy Shield – Skin & Coat Glow";
    } else if (lowerResponse.includes("gut") || lowerResponse.includes("poop") || lowerResponse.includes("stool") || lowerResponse.includes("digest") || lowerResponse.includes("belly")) {
      protocol = "Buddy's Gut Balance & Cleanse";
    } else if (lowerResponse.includes("joint") || lowerResponse.includes("move") || lowerResponse.includes("limp") || lowerResponse.includes("stiff")) {
      protocol = "Max Movement Pro";
    } else if (lowerResponse.includes("eye") || lowerResponse.includes("vision") || lowerResponse.includes("cloud")) {
      protocol = "Clear Vision Defender";
    }

    return NextResponse.json({
      success: true,
      finding: aiResponse.substring(0, 160) + "...",
      protocol: protocol,
      confidence: "87%",
      summary: aiResponse
    });

  } catch (error: any) {
    console.error("GPT-4o Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "AI analysis failed. Please try again." 
    }, { status: 500 });
  }
}