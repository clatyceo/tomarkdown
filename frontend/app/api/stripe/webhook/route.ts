import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
  });

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email || session.metadata?.email;
      if (email) {
        try {
          await fetch(`${BACKEND_URL}/api/v1/keys/upgrade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, tier: "pro" }),
          });
        } catch (err) {
          console.error("Failed to upgrade user tier:", err);
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      try {
        // Retrieve customer email from Stripe
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted && customer.email) {
          await fetch(`${BACKEND_URL}/api/v1/keys/upgrade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: customer.email, tier: "free" }),
          });
        }
      } catch (err) {
        console.error("Failed to downgrade user tier:", err);
      }
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail =
        typeof invoice.customer_email === "string"
          ? invoice.customer_email
          : null;
      if (customerEmail) {
        console.warn(
          `Payment failed for ${customerEmail}. Consider notifying the user.`
        );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
