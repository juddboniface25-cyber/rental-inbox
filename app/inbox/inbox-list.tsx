"use client";

import { useState } from "react";
import type { Inquiry } from "@/lib/inquiries";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function InboxList({ initial }: { initial: Inquiry[] }) {
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function mark(id: string) {
    setBusyId(id);
    try {
      const response = await fetch("/api/inbox/contacted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const body = (await response.json()) as { inquiry: Inquiry };
        setItems((current) =>
          current.map((item) => (item.id === id ? body.inquiry : item)),
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="mt-8 rounded-2xl border border-[#ddd4c6] bg-white p-6 text-[#5a5a5a]">
        No inquiries yet.
      </p>
    );
  }

  return (
    <ul className="mt-8 grid gap-4">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-2xl border border-[#ddd4c6] bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-[#12364a]">{item.name}</p>
              <p className="text-sm text-[#5a5a5a]">{formatWhen(item.createdAt)} ET</p>
            </div>
            {item.contacted ? (
              <span className="rounded-full bg-[#e7f3ea] px-3 py-1 text-xs font-semibold text-[#1f4d3a]">
                Contacted
              </span>
            ) : (
              <button
                type="button"
                disabled={busyId === item.id}
                onClick={() => mark(item.id)}
                className="rounded-full bg-[#12364a] px-3 py-1 text-xs font-semibold text-white disabled:opacity-60"
              >
                {busyId === item.id ? "Saving..." : "Mark contacted"}
              </button>
            )}
          </div>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[#7a7a7a]">Phone</dt>
              <dd>
                <a className="underline" href={"tel:" + item.phone}>
                  {item.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[#7a7a7a]">Email</dt>
              <dd>{item.email ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-[#7a7a7a]">Stay</dt>
              <dd>
                {item.checkIn} to {item.checkOut}
              </dd>
            </div>
            <div>
              <dt className="text-[#7a7a7a]">Area / party</dt>
              <dd>
                {item.area} · {item.partySize}
              </dd>
            </div>
          </dl>
          {item.message ? (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#3a3a3a]">
              {item.message}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
