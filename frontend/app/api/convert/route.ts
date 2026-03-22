import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";

  try {
    let backendRes: Response;

    if (contentType.includes("application/json")) {
      // URL conversion (YouTube)
      const body = await request.json();
      backendRes = await fetch(`${BACKEND_URL}/convert/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      // File conversion (PDF, DOCX)
      const formData = await request.formData();
      backendRes = await fetch(`${BACKEND_URL}/convert`, {
        method: "POST",
        body: formData,
      });
    }

    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { detail: "Backend service unavailable" },
      { status: 502 }
    );
  }
}
