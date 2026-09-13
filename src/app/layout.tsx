import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "StudyForge",
  description: "Turn raw notes into flashcards and quizzes with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <NavBar />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</main>
        <footer className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-slate-400 sm:px-6">
          StudyForge — capstone skeleton
        </footer>
      </body>
    </html>
  );
}
