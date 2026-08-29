import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { Inquiry } from "./inquiries";

function formatInquiry(inquiry: Inquiry): string {
  return [
    "New after-hours inquiry (not a booking)",
    `ID: ${inquiry.id}`,
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    `Email: ${inquiry.email ?? "(none)"}`,
    `Stay: ${inquiry.checkIn} to ${inquiry.checkOut}`,
    `Area: ${inquiry.area}`,
    `Party size: ${inquiry.partySize}`,
    `Message: ${inquiry.message || "(none)"}`,
    `Created: ${inquiry.createdAt}`,
  ].join("\n");
}

async function writeOutbox(inquiry: Inquiry, summary: string): Promise<void> {
  const dir = path.join(process.cwd(), "data", "outbox");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${inquiry.id}.txt`);
  await writeFile(file, summary + "\n", "utf8");
}

export async function notifyOwner(inquiry: Inquiry): Promise<void> {
  const summary = formatInquiry(inquiry);
  console.log("[rental-inbox] new inquiry\n" + summary);

  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!apiKey || !ownerEmail) {
    await writeOutbox(inquiry, summary);
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rental Inbox <onboarding@resend.dev>",
        to: [ownerEmail],
        subject: "New SML inquiry from " + inquiry.name,
        text: summary,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("[rental-inbox] email notify failed", response.status, body);
      await writeOutbox(inquiry, summary);
    }
  } catch (error) {
    console.error("[rental-inbox] email notify failed", error);
    await writeOutbox(inquiry, summary);
  }
}
