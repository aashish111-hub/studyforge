"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NoteInputForm() {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim()) {
      setError("Paste some notes first — there's nothing to generate from.");
      return;
    }
    sessionStorage.setItem("studyforge:notes", notes);
    router.push("/generate");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <label htmlFor="notes" className="sr-only">
        Study notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Paste raw notes, a textbook chapter, or lecture transcript here…"
        rows={9}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? "notes-error" : undefined}
        className="w-full resize-y rounded-lg border border-slate-300 p-4 text-sm shadow-sm transition-shadow focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
      {error && (
        <p id="notes-error" role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{notes.length} characters</span>
        <button
          type="submit"
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:ring-offset-2"
        >
          Generate flashcards
        </button>
      </div>
    </form>
  );
}
