import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE_NAME = "damc_member_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export interface MemberSessionData {
  id: string;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  title: string | null;
  slug: string;
}

function getSecretKey(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "damc-secret-member-session-key-2026";
}

function signPayload(payloadStr: string): string {
  const secret = getSecretKey();
  const signature = createHmac("sha256", secret).update(payloadStr).digest("base64url");
  const encodedPayload = Buffer.from(payloadStr, "utf8").toString("base64url");
  return `${encodedPayload}.${signature}`;
}

function verifyPayload(cookieValue: string): MemberSessionData | null {
  try {
    const parts = cookieValue.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;
    const payloadStr = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const secret = getSecretKey();
    const expectedSignature = createHmac("sha256", secret).update(payloadStr).digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    return JSON.parse(payloadStr) as MemberSessionData;
  } catch {
    return null;
  }
}

export async function getMemberSession(): Promise<MemberSessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifyPayload(cookie.value);
}

export async function createMemberSession(member: MemberSessionData): Promise<void> {
  const cookieStore = await cookies();
  const payloadStr = JSON.stringify(member);
  const token = signPayload(payloadStr);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroyMemberSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
