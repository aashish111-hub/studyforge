import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "studyforge",
    timestamp: new Date().toISOString(),
  });
}
