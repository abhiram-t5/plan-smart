import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { chatResponseSchema, finalTripSchema } from "./zodSchema";
import { transformBrokenTripPlan } from "./parsing";

/* -----------------------------
   Gemini Client
-------------------------------- */

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/* -----------------------------
   Gemini Call
-------------------------------- */

export async function generateWithGemini({
  systemPrompt,
  messages,
  isFinal,
}: {
  systemPrompt: string;
  messages: ChatMessage[];
  isFinal: boolean;
}) {
  const contents = [
    {
      role: "user",
      parts: [{ text: systemPrompt }],
    },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,

      // ❗ ONLY enforce schema for chat messages
      ...(isFinal
        ? {}
        : {
            // @ts-ignore
            responseJsonSchema: zodToJsonSchema(chatResponseSchema),
          }),
    },
  });

  /* 🔴 ADD THESE TWO LOGS 🔴 */
  console.log("🧠 Gemini FULL raw model response object:", response);
  console.log("🧠 Gemini raw response text:", response.text);

  /* -----------------------------
     NON-FINAL (chat flow)
  -------------------------------- */
  if (!isFinal) {
    try {
      //@ts-ignore
      return chatResponseSchema.parse(JSON.parse(response.text));
    } catch {
      return {
        resp: response.text,
        ui: null,
      };
    }
  }

  /* -----------------------------
     FINAL RESPONSE (trip)
  -------------------------------- */
  // FINAL RESPONSE — NEVER THROW AFTER THIS
  if (isFinal) {
    try {
      // @ts-ignore
      const parsed = JSON.parse(response.text);

      // ✅ Validate ROOT object (THIS WAS FAILING BEFORE)
      const validated = finalTripSchema.parse(parsed);

      // ✅ Wrap ONLY here (API contract)
      return {
        trip_plan: validated,
      };
    } catch (err) {
      console.warn("⚠️ Gemini JSON invalid — using local recovery", err);

      return {
        // @ts-ignore
        trip_plan: transformBrokenTripPlan(response.text),
      };
    }
  }
}
