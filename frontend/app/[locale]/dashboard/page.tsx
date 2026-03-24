"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const [email, setEmail] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [user, setUser] = useState<{
    email: string;
    tier: string;
    daily_limit: number;
    daily_used: number;
    created_at: number;
  } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const fetchUser = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "x-session-token": token },
      });
      if (!res.ok) {
        localStorage.removeItem("session_token");
        setSessionToken(null);
        return;
      }
      const data = await res.json();
      setUser(data.user);
    } catch {
      localStorage.removeItem("session_token");
      setSessionToken(null);
    }
  }, []);

  // Check for existing session or token in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      // Verify magic link token
      (async () => {
        try {
          const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenFromUrl }),
          });
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem("session_token", data.session_token);
            setSessionToken(data.session_token);
            setUser(data.user);
            // Clean up URL
            window.history.replaceState({}, "", window.location.pathname);
          }
        } catch {
          // ignore
        } finally {
          setInitializing(false);
        }
      })();
    } else {
      const stored = localStorage.getItem("session_token");
      if (stored) {
        setSessionToken(stored);
        fetchUser(stored).finally(() => setInitializing(false));
      } else {
        setInitializing(false);
      }
    }
  }, [fetchUser]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setMagicLinkSent(false);

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          redirect_url: window.location.origin,
        }),
      });

      if (!res.ok) {
        setError("Failed to send magic link");
        return;
      }

      const data = await res.json();

      // In dev mode, auto-verify the token
      if (data.token) {
        const verifyRes = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: data.token }),
        });
        if (verifyRes.ok) {
          const verifyData = await verifyRes.json();
          localStorage.setItem("session_token", verifyData.session_token);
          setSessionToken(verifyData.session_token);
          setUser(verifyData.user);
          return;
        }
      }

      setMagicLinkSent(true);
    } catch {
      setError("Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateKey = async () => {
    if (!sessionToken) return;
    if (!window.confirm(t("regenerateConfirm"))) return;

    setLoading(true);
    try {
      const res = await fetch("/api/keys/regenerate", {
        method: "POST",
        headers: { "x-session-token": sessionToken },
      });
      if (res.ok) {
        const data = await res.json();
        setApiKey(data.api_key);
        // Refresh user data
        await fetchUser(sessionToken);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("session_token");
    setSessionToken(null);
    setUser(null);
    setApiKey(null);
    setEmail("");
  };

  const handleCopyKey = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 8) + "...";
  };

  const usagePercent = user
    ? Math.min(100, Math.round((user.daily_used / user.daily_limit) * 100))
    : 0;

  if (initializing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!sessionToken) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("h1")}</h1>
        <p className="text-gray-600 mb-8">{t("signInDesc")}</p>

        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 px-6 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : t("sendMagicLink")}
          </button>
        </form>

        {magicLinkSent && (
          <p className="mt-4 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl">
            {t("magicLinkSent")}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        <p className="mt-6 text-sm text-gray-500">{t("noAccount")}</p>
      </div>
    );
  }

  // Logged in
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("h1")}</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          {t("signOut")}
        </button>
      </div>

      {/* User info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t("email")}</p>
            <p className="text-lg font-medium text-gray-900">
              {user?.email || "..."}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              user?.tier === "pro"
                ? "bg-gray-900 text-white"
                : user?.tier === "team"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {user?.tier || "free"}
          </span>
        </div>
      </div>

      {/* API Key */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <p className="text-sm text-gray-500 mb-2">{t("apiKey")}</p>
        {apiKey ? (
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-2 bg-gray-50 rounded-lg text-sm font-mono text-gray-800 select-all">
              {maskKey(apiKey)}
            </code>
            <button
              onClick={handleCopyKey}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {copied ? "Copied!" : t("copyKey")}
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            {user
              ? t("noAccount")
              : "..."}
          </p>
        )}
        <button
          onClick={handleRegenerateKey}
          disabled={loading}
          className="mt-4 text-sm text-gray-500 hover:text-gray-900 underline transition-colors disabled:opacity-50"
        >
          {t("regenerateKey")}
        </button>
      </div>

      {/* Usage */}
      {user && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <p className="text-sm text-gray-500 mb-3">{t("usage")}</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">
              {user.daily_used}
            </span>
            <span className="text-gray-400">/ {user.daily_limit}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                usagePercent > 80 ? "bg-red-500" : usagePercent > 50 ? "bg-yellow-500" : "bg-gray-900"
              }`}
              style={{ width: `${usagePercent}%` }}
              role="progressbar"
              aria-valuenow={user.daily_used}
              aria-valuemin={0}
              aria-valuemax={user.daily_limit}
            />
          </div>
        </div>
      )}

      {/* Plan */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500 mb-2">{t("tier")}</p>
        <p className="text-lg font-medium text-gray-900 capitalize mb-4">
          {user?.tier || "free"}
        </p>
        {user?.tier === "free" && (
          <Link
            href="/pricing"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            {t("upgradeToPro")}
          </Link>
        )}
      </div>
    </div>
  );
}
