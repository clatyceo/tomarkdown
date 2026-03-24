"use client";

import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useRef, useState } from "react";

interface PaddleCheckoutButtonProps {
  priceId: string;
  label: string;
  className?: string;
}

export function CheckoutButton({ priceId, label, className }: PaddleCheckoutButtonProps) {
  const [paddle, setPaddle] = useState<Paddle>();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!token) return;

    initializePaddle({
      environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as "sandbox" | "production") || "sandbox",
      token,
      eventCallback: (event) => {
        if (event.name === "checkout.completed" || event.name === "checkout.closed") {
          setCheckoutOpen(false);
        }
      },
    }).then((instance) => {
      if (!cancelled.current && instance) setPaddle(instance);
    });

    return () => { cancelled.current = true; };
  }, []);

  const handleClick = () => {
    if (!paddle) return;
    setCheckoutOpen(true);

    paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: {
        displayMode: "overlay",
        theme: "light",
      },
    });
  };

  if (!process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN) {
    return (
      <button disabled className={className}>
        {label}
      </button>
    );
  }

  return (
    <button onClick={handleClick} disabled={checkoutOpen || !paddle} className={className}>
      {checkoutOpen ? "..." : label}
    </button>
  );
}
