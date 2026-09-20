import type { GenerationResult } from "./types";

// Groq: free tier, no credit card required, OpenAI-compatible endpoint.
// https://console.groq.com — get a free key, set GROQ_API_KEY.
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";
const MAX_NOTES_LENGTH = 8000;

/**
 * Turns raw notes into flashcards + quiz questions.
 * This is the actual AI feature: it must produce studyable, structured
 * output from unstructured text, not just echo/chat.
 */
export async function generateStudyMaterial(
  notes: string
): Promise<GenerationResult> {
  const trimmed = notes.trim();
  if (!trimmed) {
    throw new Error("Notes are empty.");
  }
  if (trimmed.length > MAX_NOTES_LENGTH) {
    throw new Error(
      `Notes too long (${trimmed.length} chars). Limit is ${MAX_NOTES_LENGTH}.`
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const prompt = `You turn study notes into flashcards and a quiz. Read the notes below and produce 5-8 flashcards and 3-5 multiple-choice quiz questions (4 options each) that test understanding of the material, not trivia about wording.

Respond with ONLY valid JSON, no prose, no markdown fences, matching exactly this shape:
{"flashcards":[{"question":"...","answer":"..."}],"quiz":[{"question":"...","options":["...","...","...","..."],"correctIndex":0}]}

Notes:
"""
${trimmed}
"""`;

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new Error("Model returned no text content.");
  }

  return parseAndValidate(text);
}

/**
 * Resilience: the model can (and sometimes will) return malformed JSON,
 * wrap it in a code fence, or drop a field. This validates shape before
 * trusting it, so a bad model response fails loudly instead of crashing
 * the UI with undefined.map() somewhere downstream.
 */
export function parseAndValidate(raw: string): GenerationResult {
  const cleaned = raw.trim().replace(/^```json\s*|```$/g, "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Model response was not valid JSON.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("flashcards" in parsed) ||
    !("quiz" in parsed)
  ) {
    throw new Error("Model response missing required fields.");
  }

  const { flashcards, quiz } = parsed as Record<string, unknown>;

  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    throw new Error("Model returned no flashcards.");
  }
  for (const card of flashcards) {
    if (
      typeof card !== "object" ||
      card === null ||
      typeof (card as Record<string, unknown>).question !== "string" ||
      typeof (card as Record<string, unknown>).answer !== "string"
    ) {
      throw new Error("Malformed flashcard in model response.");
    }
  }

  if (!Array.isArray(quiz) || quiz.length === 0) {
    throw new Error("Model returned no quiz questions.");
  }
  for (const q of quiz) {
    const question = q as Record<string, unknown>;
    if (
      typeof question.question !== "string" ||
      !Array.isArray(question.options) ||
      question.options.length < 2 ||
      typeof question.correctIndex !== "number" ||
      question.correctIndex < 0 ||
      question.correctIndex >= question.options.length
    ) {
      throw new Error("Malformed quiz question in model response.");
    }
  }

  return parsed as GenerationResult;
}
