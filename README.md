# Rental Inbox

After-hours inquiry answering for small independent vacation-rental managers around Smith Mountain Lake, VA.

**$349/mo** (copy only — there is no Stripe and no checkout).

## What it is

A guest inquiry form and a secret-gated owner inbox. Guests leave name, phone, dates, area, party size, and a message. The owner sees newest inquiries first and marks them contacted.

This is an **inquiry** product. Submitting the form does not reserve a home.

## What it is not

- Not a PMS, calendar, or channel manager
- Not Hostaway, Streamline, or Airbnb sync
- Not 24/7 guest messaging, check-in, door codes, or emergencies
- Not After Five / restaurant call box
- Not billing / Stripe
- Not multi-tenant SaaS auth

## Run locally

```bash
npm install && npm run dev
```

Open http://localhost:3000

`npm install && npm run dev` starts the app. `npm run build` must pass before you ship.

```bash
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and fill in values. Do not commit `.env.local`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `INBOX_SECRET` | Yes, to open `/inbox` | Shared secret for the owner inbox |
| `OWNER_EMAIL` | No | Owner address for inquiry email |
| `RESEND_API_KEY` | No | If set **with** `OWNER_EMAIL`, send email via Resend |

Guest submit always succeeds even when email is not configured. In that case the payload is logged to the console and written to `data/outbox/`.

Inquiries are stored in `data/inquiries.json`.

## How INBOX_SECRET works

1. Set `INBOX_SECRET` in `.env.local` to a long random string.
2. Open `/inbox`.
3. Either enter that string in the password field, **or** visit `/inbox?secret=YOUR_SECRET`.
4. The password field sets an httpOnly cookie so you stay signed in. Query-param access works for a single visit.

If `INBOX_SECRET` is missing, `/inbox` stays closed. There is no guest messaging from the inbox.

## Pages

- `/` — one-screen pitch for managers
- `/inquire` — public inquiry form
- `/inbox` — owner inbox (secret-gated)

Crawlers are blocked (`app/robots.ts` disallows all; metadata is noindex,nofollow).
