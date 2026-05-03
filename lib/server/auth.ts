import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8시간

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET 환경변수가 설정되지 않았습니다.");
  return secret;
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await globalThis.crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// 상수 시간 문자열 비교 (timing attack 방지)
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function verifySession(token: string): Promise<boolean> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;

  const timestamp = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  try {
    const expectedSig = await hmacSign(getSecret(), timestamp);
    if (!timingSafeEqual(sig, expectedSig)) return false;
  } catch {
    return false;
  }

  const age = (Date.now() - Number(timestamp)) / 1000;
  return age >= 0 && age < COOKIE_MAX_AGE;
}

export async function verifyAdminPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}

export async function createSessionCookie(res: NextResponse): Promise<NextResponse> {
  const timestamp = Date.now().toString();
  const sig = await hmacSign(getSecret(), timestamp);
  const token = `${timestamp}.${sig}`;
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

export async function verifySessionFromRequest(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySession(token);
}

export async function requireAdminAuth(
  req: NextRequest
): Promise<NextResponse | null> {
  if (!(await verifySessionFromRequest(req))) {
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 }
    );
  }
  return null;
}
