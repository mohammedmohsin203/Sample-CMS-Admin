import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getCoordinates(universityName, country, region) {
    const prompt = `Give me only latitude and longitude in JSON for this university:
  Name: ${universityName}, Country: ${country}, Region: ${region}.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    try {
        const jsonText = result.response.text();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Gemini parsing failed", e);
        return { latitude: 0, longitude: 0 };
    }
}
