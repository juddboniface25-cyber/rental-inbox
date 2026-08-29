"use client";

import { FormEvent, useState } from "react";

export function GateForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const secret = String(new FormData(event.currentTarget).get("secret") ?? "");
    try {
      const response = await fetch("/api/inbox/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Could not open inbox.");
        setPending(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-md gap-3">
      <label className="text-sm font-semibold">
        Inbox secret
        <input
          className="mt-1 w-full rounded-xl border border-[#ddd4c6] bg-white px-3 py-2.5"
          name="secret"
          type="password"
          required
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="text-sm text-[#9b2c2c]">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#12364a] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Checking..." : "Open inbox"}
      </button>
    </form>
  );
}
