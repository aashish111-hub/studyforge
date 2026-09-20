import { describe, it, expect } from "vitest";
import { parseAndValidate } from "./generate";

const VALID = JSON.stringify({
  flashcards: [{ question: "Q1", answer: "A1" }],
  quiz: [
    { question: "Q?", options: ["a", "b", "c", "d"], correctIndex: 1 },
  ],
});

describe("parseAndValidate", () => {
  it("accepts well-formed JSON", () => {
    const result = parseAndValidate(VALID);
    expect(result.flashcards).toHaveLength(1);
    expect(result.quiz[0].correctIndex).toBe(1);
  });

  it("strips a markdown code fence before parsing", () => {
    const fenced = "```json\n" + VALID + "\n```";
    const result = parseAndValidate(fenced);
    expect(result.flashcards).toHaveLength(1);
  });

  it("rejects invalid JSON", () => {
    expect(() => parseAndValidate("not json")).toThrow(
      "not valid JSON"
    );
  });

  it("rejects a response missing the quiz field", () => {
    const missing = JSON.stringify({ flashcards: [{ question: "Q", answer: "A" }] });
    expect(() => parseAndValidate(missing)).toThrow("missing required fields");
  });

  it("rejects a flashcard missing an answer", () => {
    const bad = JSON.stringify({
      flashcards: [{ question: "Q only" }],
      quiz: [{ question: "Q?", options: ["a", "b"], correctIndex: 0 }],
    });
    expect(() => parseAndValidate(bad)).toThrow("Malformed flashcard");
  });

  it("rejects a quiz question with an out-of-range correctIndex", () => {
    const bad = JSON.stringify({
      flashcards: [{ question: "Q", answer: "A" }],
      quiz: [{ question: "Q?", options: ["a", "b"], correctIndex: 5 }],
    });
    expect(() => parseAndValidate(bad)).toThrow("Malformed quiz question");
  });

  it("rejects an empty flashcards array", () => {
    const bad = JSON.stringify({
      flashcards: [],
      quiz: [{ question: "Q?", options: ["a", "b"], correctIndex: 0 }],
    });
    expect(() => parseAndValidate(bad)).toThrow("no flashcards");
  });
});
