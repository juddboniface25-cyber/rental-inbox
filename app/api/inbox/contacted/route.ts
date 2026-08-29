import { NextResponse } from "next/server";
import { isInboxAuthorized } from "@/lib/auth";
import { markContacted } from "@/lib/inquiries";

export async function POST(request: Request) {
  if (!(await isInboxAuthorized())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { id?: unknown };
  try {
    body = (await request.json()) as { id?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  const inquiry = await markContacted(id);
  if (!inquiry) {
    return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
  }

  return NextResponse.json({ inquiry });
}
