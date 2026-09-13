"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Client Component: the only interactive piece on the home screen.
// This is a skeleton — it navigates to /generate, which will call the
// AI generation endpoint in a later assignment (FE-06/07).
export function NoteInputForm() {
  const [notes, setNotes] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Placeholder: real submission will POST to an AI generation route.
    router.push("/generate");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="notes" className="sr-only">
        Paste your notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste raw notes, a textbook chapter, or lecture transcript here…"
        rows={10}
        className="w-full rounded-lg border border-slate-300 p-4 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
      >
        Generate flashcards
      </button>
    </form>
  );
}
