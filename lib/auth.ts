import { cookies } from "next/headers";

export const INBOX_COOKIE = "rental_inbox_auth";

export function getInboxSecret(): string | undefined {
  const secret = process.env.INBOX_SECRET;
  return secret && secret.trim() ? secret.trim() : undefined;
}

export function secretsMatch(provided: string, expected: string): boolean {
  return provided === expected;
}

export async function isInboxAuthorized(querySecret?: string): Promise<boolean> {
  const secret = getInboxSecret();
  if (!secret) return false;
  if (querySecret && secretsMatch(querySecret, secret)) return true;
  const jar = await cookies();
  return jar.get(INBOX_COOKIE)?.value === secret;
}
