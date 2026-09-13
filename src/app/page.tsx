import { NoteInputForm } from "@/components/NoteInputForm";

// Server Component — static shell around the interactive form.
export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Turn your notes into study material
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Paste raw lecture notes or textbook text below. StudyForge will
          generate structured flashcards and quiz questions you can study
          from immediately.
        </p>
      </div>
      <NoteInputForm />
    </div>
  );
}
