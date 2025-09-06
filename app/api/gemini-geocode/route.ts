import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, country, region, category } = await req.json();

    const prompt = `Give me only the latitude and longitude for "${name}, ${region}, ${country}".
Return strictly as JSON with keys "latitude" and "longitude", nothing else.`;

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        }
    );

    const data = await response.json();

    let latitude = null;
    let longitude = null;

    try {
        const rawText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        // Strip code fences if Gemini returns ```json ... ```
        const cleanText = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanText);

        latitude = parsed.latitude;
        longitude = parsed.longitude;
    } catch (e) {
        console.error("Failed to parse Gemini response:", e);
    }

    return NextResponse.json({
        name,
        country,
        region,
        category,
        latitude,
        longitude,
    });
}
