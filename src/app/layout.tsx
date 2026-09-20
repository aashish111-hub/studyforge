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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <NavBar />
        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>
        <footer className="mx-auto max-w-3xl px-4 py-8 text-center text-xs text-slate-400 sm:px-6">
          StudyForge
        </footer>
      </body>
    </html>
  );
}
