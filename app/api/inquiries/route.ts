import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/inquiries";
import { notifyOwner } from "@/lib/notify";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = asString(body.name);
  const phone = asString(body.phone);
  const email = asString(body.email);
  const checkIn = asString(body.checkIn);
  const checkOut = asString(body.checkOut);
  const area = asString(body.area);
  const message = asString(body.message);
  const partySize = Number(body.partySize);

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!phone || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { error: "A valid phone number is required." },
      { status: 400 },
    );
  }
  if (email && !email.includes("@")) {
    return NextResponse.json({ error: "Email looks invalid." }, { status: 400 });
  }
  if (!isDate(checkIn) || !isDate(checkOut)) {
    return NextResponse.json(
      { error: "Check-in and check-out dates are required." },
      { status: 400 },
    );
  }
  if (checkOut <= checkIn) {
    return NextResponse.json(
      { error: "Check-out must be after check-in." },
      { status: 400 },
    );
  }
  if (!area) {
    return NextResponse.json(
      { error: "Area or property is required." },
      { status: 400 },
    );
  }
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 30) {
    return NextResponse.json(
      { error: "Party size must be between 1 and 30." },
      { status: 400 },
    );
  }
  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  try {
    const inquiry = await createInquiry({
      name,
      phone,
      email,
      checkIn,
      checkOut,
      area,
      partySize,
      message,
    });

    try {
      await notifyOwner(inquiry);
    } catch (error) {
      console.error("[rental-inbox] notify threw", error);
    }

    return NextResponse.json({
      ok: true,
      id: inquiry.id,
      confirmation:
        "We got it. The owner will follow up. This is not a booking.",
    });
  } catch (error) {
    console.error("[rental-inbox] persist failed", error);
    return NextResponse.json(
      { error: "Could not save inquiry. Try again." },
      { status: 500 },
    );
  }
}
