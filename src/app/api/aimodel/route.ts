import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { aj } from "@/utils/arcjet";
import { generateWithGemini } from "@/utils/gemini";

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by **asking one relevant trip-related question at a time**.

 Only ask questions about the following details in order, and wait for the user’s answer before asking the next: 

1. Starting location (source) 
2. Destination city or country 
3. Group size (Solo, Couple, Family, Friends) 
4. Budget (Low, Medium, High) 
5. Trip duration (number of days)  
6. Special requirements or preferences (if any)
Do not ask multiple questions at once, and never ask irrelevant questions.
If any answer is missing or unclear, politely ask the user to clarify before proceeding.
Always maintain a conversational, interactive style while asking questions.
Along wth response also send which ui component to display for generative UI for example 'budget/groupSize/tripDuration/final,null) ,
 where ui:final means AI is not asking any more question and informing user that now trip is generating, Please wait.
Once all required information is collected, generate and return a **strict JSON response only** (no explanations or extra text) with following JSON schema:
{
resp:'Text Resp',
ui:'budget/groupSize/tripDuration/final)'
}

`;

const FINAL_PROMPT = `Generate Travel Plan with give details, give me Hotels options list with HotelName, 
Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and  suggest itinerary with placeName, Place Details, Place Image Url,
 Geo Coordinates,Place address, ticket Pricing, Time travel each of the location , with each day plan with best time to visit.
Generate and return a **strict JSON response only** (no explanations or extra text) with following JSON schema:
{
  "destination": "string",
  "duration": "string",
  "origin": "string",
  "budget": "string",
  "group_size": "string",
  "hotels": [
    {
      "hotel_name": "string",
      "hotel_address": "string",
      "price_per_night": "string",
      "hotel_image_url": "string",
      "geo_coordinates": {
        "latitude": "number",
        "longitude": "number"
      },
      "rating": "number",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": "number",
      "day_plan": "string",
      "best_time_to_visit_day": "string",
      "activities": [
        {
          "place_name": "string",
          "place_details": "string",
          "place_image_url": "string",
          "geo_coordinates": {
            "latitude": "number",
            "longitude": "number"
          },
          "place_address": "string",
          "ticket_pricing": "string",
          "time_travel_each_location": "string",
          "best_time_to_visit": "string"
        }
      ]
    }
  ]
}`;

type GeminiResponse = {
  resp?: string;
  ui?: string;
  trip_plan?: unknown;
};

function extractTripPlan(result: any) {
  // Case 1: Gemini already returned clean trip JSON
  if (
    result &&
    typeof result === "object" &&
    result.destination &&
    result.itinerary
  ) {
    return result;
  }

  // Case 2: Gemini returned string (just in case)
  if (typeof result === "string") {
    try {
      const parsed = JSON.parse(result);
      if (parsed?.destination && parsed?.itinerary) {
        return parsed;
      }
    } catch {}
  }

  return null;
}


export async function POST(req: NextRequest) {
  console.log("API /api/aimodel POST invoked");

  try {
    const { messages, isFinal } = await req.json();

    const systemPrompt = isFinal ? FINAL_PROMPT : PROMPT;

    const result = await generateWithGemini({
      systemPrompt,
      messages,
      isFinal,
    });

    // 🔴 IMPORTANT: JUST RETURN RESULT AS-IS
    // 🔴 DO NOT TOUCH IT
    // 🔴 DO NOT VALIDATE AGAIN
    // 🔴 DO NOT CHECK trip_plan EXISTS

    console.log("🧠 Final API response:", result);

    return NextResponse.json(result);
  } catch (e) {
    console.error("❌ AI error:", e);

    return NextResponse.json({
      resp: "❌ Failed to generate trip plan. Please try again.",
      ui: null,
    });
  }
}
