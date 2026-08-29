import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f4efe6] text-[#1a1a1a]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-sm font-semibold tracking-[0.18em] text-[#12364a] uppercase">
          Rental Inbox
        </p>
        <Link
          href="/inquire"
          className="rounded-full bg-[#12364a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0e2b3b]"
        >
          Guest inquiry form
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-16">
        <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[#c46a3a] uppercase">
          After-hours inquiries · Smith Mountain Lake
        </p>
        <h1 className="max-w-3xl text-4xl leading-[1.08] font-medium text-[#12364a] sm:text-6xl">
          Never miss a Friday-night inquiry because it is after 5pm.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3a3a3a]">
          A guest still asks after dinner. They get a form, not voicemail. You
          get the inquiry in a private inbox and call back. This is not a
          booking, not a PMS, and not 24/7 guest comms.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/inquire"
            className="rounded-full bg-[#c46a3a] px-6 py-3 text-base font-semibold text-white hover:bg-[#b05d32]"
          >
            Open the inquiry form
          </Link>
          <p className="text-sm text-[#4a4a4a]">$349/mo · copy only, no Stripe</p>
        </div>
        <ul className="mt-12 grid max-w-3xl gap-3 text-sm text-[#3a3a3a] sm:grid-cols-3">
          <li className="rounded-2xl border border-[#ddd4c6] bg-white px-4 py-3">
            Inquiry form. Not a reservation.
          </li>
          <li className="rounded-2xl border border-[#ddd4c6] bg-white px-4 py-3">
            Owner inbox. Mark contacted.
          </li>
          <li className="rounded-2xl border border-[#ddd4c6] bg-white px-4 py-3">
            Not Hostaway, calendars, or door codes.
          </li>
        </ul>
      </section>
    </main>
  );
}
