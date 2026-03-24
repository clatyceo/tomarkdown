import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.headers.get("x-session-token");
    if (!sessionToken) {
      return NextResponse.json({ error: "Missing session token" }, { status: 401 });
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
      headers: { "x-session-token": sessionToken },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("Auth me proxy error:", err);
    return NextResponse.json(
      { error: "Backend service unavailable" },
      { status: 502 }
    );
  }
}
