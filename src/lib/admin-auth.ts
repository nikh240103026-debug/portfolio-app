import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

export const adminSessionCookie = "portfolio_admin_session";
export const adminSessionMaxAge = 60 * 60 * 8;

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

export function createAdminSessionValue() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");

  const expiresAt = String(Math.floor(Date.now() / 1000) + adminSessionMaxAge);
  const signature = createHmac("sha256", secret).update(expiresAt).digest("hex");
  return `${expiresAt}.${signature}`;
}

export function hasAdminSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${adminSessionCookie}=`));
  const value = cookie?.slice(adminSessionCookie.length + 1);
  const [expiresAt, signature] = value?.split(".") ?? [];
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || !expiresAt || !/^\d+$/.test(expiresAt) || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expected = createHmac("sha256", secret).update(expiresAt).digest();
  const actual = Buffer.from(signature, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}