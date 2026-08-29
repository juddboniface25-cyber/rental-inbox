"use client";

import { FormEvent, useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function InquireForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      checkIn: String(data.get("checkIn") ?? ""),
      checkOut: String(data.get("checkOut") ?? ""),
      area: String(data.get("area") ?? ""),
      partySize: Number(data.get("partySize") ?? 0),
      message: String(data.get("message") ?? ""),
    };

    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus({
          kind: "error",
          message: body.error ?? "Could not send inquiry. Try again.",
        });
        return;
      }
      form.reset();
      setStatus({ kind: "success" });
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Your inquiry was not sent.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="rounded-3xl border border-[#c9decc] bg-[#f3faf5] p-8">
        <h2 className="text-3xl text-[#1f4d3a]">Inquiry received</h2>
        <p className="mt-4 leading-7 text-[#2c3d33]">
          We got it. The owner will follow up. This is not a booking.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-[#12364a] underline"
          onClick={() => setStatus({ kind: "idle" })}
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const fieldClass =
    "mt-1 w-full rounded-xl border border-[#ddd4c6] bg-white px-3 py-2.5 text-[#1a1a1a] outline-none focus:border-[#12364a]";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="text-sm font-semibold">
        Name
        <input className={fieldClass} name="name" required autoComplete="name" />
      </label>
      <label className="text-sm font-semibold">
        Phone (required)
        <input
          className={fieldClass}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="540-555-0100"
        />
      </label>
      <label className="text-sm font-semibold">
        Email (optional)
        <input
          className={fieldClass}
          name="email"
          type="email"
          autoComplete="email"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Check-in
          <input className={fieldClass} name="checkIn" type="date" required />
        </label>
        <label className="text-sm font-semibold">
          Check-out
          <input className={fieldClass} name="checkOut" type="date" required />
        </label>
      </div>
      <label className="text-sm font-semibold">
        Area / property
        <input
          className={fieldClass}
          name="area"
          required
          placeholder="Lake area or property name"
        />
      </label>
      <label className="text-sm font-semibold">
        Party size
        <input
          className={fieldClass}
          name="partySize"
          type="number"
          min={1}
          max={30}
          required
          defaultValue={2}
        />
      </label>
      <label className="text-sm font-semibold">
        Message
        <textarea
          className={`${fieldClass} min-h-28`}
          name="message"
          required
          placeholder="What are you looking for? This is an inquiry, not a reservation."
        />
      </label>
      {status.kind === "error" ? (
        <p className="text-sm text-[#9b2c2c]">{status.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="rounded-full bg-[#c46a3a] px-6 py-3 font-semibold text-white hover:bg-[#b05d32] disabled:opacity-60"
      >
        {status.kind === "submitting" ? "Sending..." : "Send inquiry"}
      </button>
      <p className="text-sm text-[#5a5a5a]">
        Submitting does not book a home. The owner will follow up.
      </p>
    </form>
  );
}
