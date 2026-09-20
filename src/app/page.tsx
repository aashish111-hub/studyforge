import { NoteInputForm } from "@/components/NoteInputForm";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent">
          AI-POWERED STUDY TOOL
        </span>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
          Turn your notes into study material
        </h1>
        <p className="max-w-lg text-slate-600">
          Paste raw lecture notes or textbook text below. StudyForge
          generates structured flashcards and quiz questions you can study
          from immediately.
        </p>
      </div>
      <NoteInputForm />
    </div>
  );
}
