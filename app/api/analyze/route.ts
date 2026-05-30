import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const symptoms = (formData.get('symptoms') || '').toString().toLowerCase().trim();

    console.log("🔍 Symptoms received:", symptoms);

    const recommendations: Array<{ protocol: string; confidence: string }> = [];

    // 1. Gut / Digestive
    if (/constipation|diarrhea|gut|stool|loose|digest|vomiting|appetite/.test(symptoms)) {
      recommendations.push({ protocol: "Buddy's Gut Balance & Cleanse", confidence: "85%" });
    }

    // 2. Joint / Mobility
    if (/joint|pain|stiff|limp|arthritis|mobility|leg|hip|shoulder/.test(symptoms)) {
      recommendations.push({ protocol: "Max Movement Pro", confidence: "88%" });
    }

    // 3. Eyes / Vision
    if (/eye|red|watery|vision|discharge|tear|cloudy/.test(symptoms)) {
      recommendations.push({ protocol: "Clear Vision Defender", confidence: "90%" });
    }

    // 4. Skin / Allergy
    if (/itch|skin|rash|allergy|scratch|hotspot|coat/.test(symptoms)) {
      recommendations.push({ protocol: "Allergy Shield", confidence: "87%" });
    }

    // 5. Heart / Fatigue / Breathing
    if (/fatigue|exhaust|breath|shortness|breathing|tired|weak|heart|panting/.test(symptoms)) {
      recommendations.push({ protocol: "Heart Vitality Pro", confidence: "89%" });
    }

    // 6. Liver / Kidney / Detox
    if (/liver|kidney|detox|urine|jaundice|appetite|weight/.test(symptoms)) {
      recommendations.push({ protocol: "Foundation Liver & Kidney Detox", confidence: "84%" });
    }

    // 7. Immune / Overall Wellness
    if (/immune|infection|recover|weak|energy|lethargy/.test(symptoms)) {
      recommendations.push({ protocol: "Immune Boost Pro", confidence: "86%" });
    }

    // 8. Dental / Oral Health
    if (/teeth|breath|dental|gums|chew|mouth/.test(symptoms)) {
      recommendations.push({ protocol: "Dental Defense Pro", confidence: "82%" });
    }

    // 9. Calm / Anxiety
    if (/anxiety|fear|stress|nervous|calm|bark|restless/.test(symptoms)) {
      recommendations.push({ protocol: "Freedom Calm Support", confidence: "83%" });
    }

    // Default fallback
    if (recommendations.length === 0) {
      recommendations.push({ protocol: "Buddy's Gut Balance & Cleanse", confidence: "65%" });
    }

    // Return up to 2 best matches
    const finalRecs = recommendations.slice(0, 2);

    return NextResponse.json({
      success: true,
      primary: finalRecs[0],
      secondary: finalRecs.length > 1 ? finalRecs[1] : null,
      finding: `Analyzed: ${symptoms}`
    });

  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ success: false, error: "Analysis failed" });
  }
}