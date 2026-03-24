import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { BACKEND_URL } from "@/lib/proxy";

const TIMESTAMP_TOLERANCE = 300; // 5 minutes

async function updateTier(email: string, tier: string): Promise<boolean> {
  const res = await fetch(`${BACKEND_URL}/api/v1/keys/upgrade`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, tier }),
  });
  return res.ok;
}

export async function POST(request: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("paddle-signature") || "";

  const parts = signature.split(";").reduce((acc, part) => {
    const [key, value] = part.split("=");
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {} as Record<string, string>);

  const ts = parts.ts;
  const h1 = parts.h1;

  if (!ts || !h1) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Replay protection
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(ts, 10)) > TIMESTAMP_TOLERANCE) {
    return NextResponse.json({ error: "Stale request" }, { status: 400 });
  }

  const signedPayload = `${ts}:${rawBody}`;
  const computed = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  const computedBuf = Buffer.from(computed);
  const h1Buf = Buffer.from(h1);
  if (computedBuf.length !== h1Buf.length || !crypto.timingSafeEqual(computedBuf, h1Buf)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = event.data?.customer?.email;
  if (!email) {
    return NextResponse.json({ received: true });
  }

  try {
    switch (event.event_type) {
      case "subscription.activated":
      case "subscription.created":
      case "subscription.updated": {
        const ok = await updateTier(email, "pro");
        if (!ok) return NextResponse.json({ error: "Backend failed" }, { status: 502 });
        break;
      }
      case "subscription.canceled": {
        const ok = await updateTier(email, "free");
        if (!ok) return NextResponse.json({ error: "Backend failed" }, { status: 502 });
        break;
      }
    }
  } catch {
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }

  return NextResponse.json({ received: true });
}
