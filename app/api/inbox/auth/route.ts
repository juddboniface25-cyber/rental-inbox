import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { INBOX_COOKIE, getInboxSecret } from "@/lib/auth";

function secretsMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = getInboxSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "INBOX_SECRET is not configured." },
      { status: 503 },
    );
  }

  let body: { secret?: unknown };
  try {
    body = (await request.json()) as { secret?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const provided = typeof body.secret === "string" ? body.secret : "";
  if (!secretsMatch(provided, secret)) {
    return NextResponse.json({ error: "Wrong secret." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: INBOX_COOKIE,
    value: secret,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
