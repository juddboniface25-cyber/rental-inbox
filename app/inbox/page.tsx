import type { Metadata } from "next";
import Link from "next/link";
import { getInboxSecret, isInboxAuthorized } from "@/lib/auth";
import { listInquiries } from "@/lib/inquiries";
import { GateForm } from "./gate-form";
import { InboxList } from "./inbox-list";

export const metadata: Metadata = {
  title: "Owner inbox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ secret?: string }>;
}) {
  const params = await searchParams;
  const secret = getInboxSecret();
  const authorized = await isInboxAuthorized(params.secret);

  return (
    <main className="min-h-screen bg-[#f4efe6] text-[#1a1a1a]">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-sm font-semibold tracking-[0.18em] text-[#12364a] uppercase"
        >
          Rental Inbox
        </Link>
        <p className="text-sm text-[#5a5a5a]">Owner only</p>
      </header>
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <h1 className="text-4xl text-[#12364a]">Inbox</h1>
        {!secret ? (
          <p className="mt-6 rounded-2xl border border-[#ead7a8] bg-[#fff7e3] p-5 leading-7">
            Set INBOX_SECRET in your environment, then reload. The inbox stays
            closed until that secret exists.
          </p>
        ) : !authorized ? (
          <>
            <p className="mt-4 max-w-xl leading-7 text-[#3a3a3a]">
              Enter the inbox secret, or open /inbox?secret=YOUR_SECRET. Newest
              inquiries first. No guest messaging.
            </p>
            <GateForm />
          </>
        ) : (
          <>
            <p className="mt-4 text-[#3a3a3a]">
              Newest inquiries first. Mark contacted after you call back.
            </p>
            <InboxList initial={await listInquiries()} />
          </>
        )}
      </section>
    </main>
  );
}
