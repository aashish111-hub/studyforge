export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface GenerationResult {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export type GenerateResponse =
  | { ok: true; data: GenerationResult }
  | { ok: false; error: string };
