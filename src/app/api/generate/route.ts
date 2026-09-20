import { NextRequest, NextResponse } from "next/server";
import { generateStudyMaterial } from "@/lib/generate";
import type { GenerateResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  let notes: string;
  try {
    const body = await req.json();
    notes = typeof body?.notes === "string" ? body.notes : "";
  } catch {
    return NextResponse.json<GenerateResponse>(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  try {
    const data = await generateStudyMaterial(notes);
    return NextResponse.json<GenerateResponse>({ ok: true, data });
  } catch (err) {
    // Resilience: never let a raw model/network error reach the client.
    // Log server-side for debugging, return a safe, user-facing message.
    console.error("generateStudyMaterial failed:", err);
    const message =
      err instanceof Error ? err.message : "Generation failed unexpectedly.";
    return NextResponse.json<GenerateResponse>(
      { ok: false, error: message },
      { status: 502 }
    );
  }
}
