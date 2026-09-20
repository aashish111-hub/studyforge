"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { GenerateResponse, GenerationResult } from "@/lib/types";

type Status = "idle" | "loading" | "success" | "error";

export function GenerateClient() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notesMissing, setNotesMissing] = useState(false);

  useEffect(() => {
    const notes = sessionStorage.getItem("studyforge:notes");
    if (!notes) {
      setNotesMissing(true);
      return;
    }
    run(notes);
  }, []);

  async function run(notes: string) {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const body: GenerateResponse = await res.json();
      if (!body.ok) {
        setStatus("error");
        setError(body.error);
        return;
      }
      setResult(body.data);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Network error — check your connection and try again.");
    }
  }

  function retry() {
    const notes = sessionStorage.getItem("studyforge:notes");
    if (notes) run(notes);
  }

  if (notesMissing) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-sm text-slate-500">
        No notes found for this session.{" "}
        <Link href="/" className="font-medium text-brand underline underline-offset-2">
          Go back and paste some notes
        </Link>
        .
      </div>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500"
      >
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        Generating flashcards and quiz questions…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="space-y-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
      >
        <p>Couldn&apos;t generate study material: {error}</p>
        <button
          onClick={retry}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-10">
      <section aria-labelledby="flashcards-heading">
        <h2
          id="flashcards-heading"
          className="mb-4 font-[family-name:var(--font-heading)] text-xl font-bold"
        >
          Flashcards
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {result.flashcards.map((card, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-semibold text-slate-800">{card.question}</p>
              <p className="mt-2 text-sm text-slate-600">{card.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="quiz-heading">
        <h2
          id="quiz-heading"
          className="mb-4 font-[family-name:var(--font-heading)] text-xl font-bold"
        >
          Quiz
        </h2>
        <ol className="space-y-3">
          {result.quiz.map((q, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="font-semibold text-slate-800">{q.question}</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {q.options.map((opt, j) => (
                  <li
                    key={j}
                    className={`rounded-md px-2 py-1 ${
                      j === q.correctIndex
                        ? "bg-accent/10 font-semibold text-accent"
                        : "text-slate-600"
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
