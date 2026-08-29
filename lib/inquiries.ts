import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export type Inquiry = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string | null;
  checkIn: string;
  checkOut: string;
  area: string;
  partySize: number;
  message: string;
  contacted: boolean;
  contactedAt: string | null;
};

export type InquiryInput = {
  name: string;
  phone: string;
  email?: string;
  checkIn: string;
  checkOut: string;
  area: string;
  partySize: number;
  message?: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "inquiries.json");

let writeChain: Promise<void> = Promise.resolve();

async function readAll(): Promise<Inquiry[]> {
  try {
    const raw = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw) as Inquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw error;
  }
}

async function writeAll(inquiries: Inquiry[]): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(inquiries, null, 2) + "\n", "utf8");
}

export async function listInquiries(): Promise<Inquiry[]> {
  const inquiries = await readAll();
  return inquiries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createInquiry(input: InquiryInput): Promise<Inquiry> {
  const inquiry: Inquiry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() ? input.email.trim() : null,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    area: input.area.trim(),
    partySize: input.partySize,
    message: input.message?.trim() ?? "",
    contacted: false,
    contactedAt: null,
  };

  writeChain = writeChain.then(async () => {
    const inquiries = await readAll();
    inquiries.push(inquiry);
    await writeAll(inquiries);
  });
  await writeChain;

  return inquiry;
}

export async function markContacted(id: string): Promise<Inquiry | null> {
  let updated: Inquiry | null = null;

  writeChain = writeChain.then(async () => {
    const inquiries = await readAll();
    const match = inquiries.find((item) => item.id === id);
    if (!match) return;
    match.contacted = true;
    match.contactedAt = new Date().toISOString();
    updated = match;
    await writeAll(inquiries);
  });
  await writeChain;

  return updated;
}
