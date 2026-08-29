import type { Metadata } from "next";
import Link from "next/link";
import { InquireForm } from "./inquire-form";

export const metadata: Metadata = {
  title: "Inquiry",
  robots: { index: false, follow: false },
};

export default function InquirePage() {
  return (
    <main className="min-h-screen bg-[#f4efe6] text-[#1a1a1a]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.18em] text-[#12364a] uppercase"
        >
          Rental Inbox
        </Link>
        <p className="text-sm text-[#5a5a5a]">Inquiry, not a booking</p>
      </header>
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h1 className="text-4xl text-[#12364a] sm:text-5xl">
          Ask about a stay at Smith Mountain Lake
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-[#3a3a3a]">
          Leave your name, phone, and dates. The owner will follow up. Sending
          this form does not reserve a home, take payment, or issue access
          codes.
        </p>
        <div className="mt-10 rounded-3xl border border-[#ddd4c6] bg-white p-6 sm:p-8">
          <InquireForm />
        </div>
      </section>
    </main>
  );
}
