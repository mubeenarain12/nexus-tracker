"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

// Web3Forms se mili hui access key yahan paste karein
const ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

type Status = "idle" | "loading" | "success" | "error";

export default function EmailInterest() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "Nexus Tracker: new alert signup",
          from_name: "Nexus Tracker",
          email,
          feedback,
        }),
      });
      const data: { success?: boolean } = await res.json();
      if (data.success) {
        setStatus("success");
        setEmail("");
        setFeedback("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="mx-auto mt-10 max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
        <p className="font-medium text-emerald-800">
          Thanks! We&apos;ll email you when alerts are ready.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Mail className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Want email alerts before you cross a nexus threshold?
        </h2>
      </div>
      <p className="mb-4 text-sm text-slate-600">
        Leave your email and we&apos;ll notify you when alerts launch. No spam.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourstore.com"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional: what feature would you like to see?"
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {status === "loading" ? "Sending..." : "Notify me"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </section>
  );
}
