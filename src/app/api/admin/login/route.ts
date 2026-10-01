import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { adminSessionCookie, adminSessionMaxAge, createAdminSessionValue, isAdminConfigured } from "@/lib/admin-auth";

const loginSchema = z.object({ password: z.string().min(1).max(256) });

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin access is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the admin password." }, { status: 400 });
  }

  const configuredPassword = process.env.ADMIN_PASSWORD ?? "";
  const submittedHash = createHash("sha256").update(parsed.data.password).digest();
  const configuredHash = createHash("sha256").update(configuredPassword).digest();
  if (!timingSafeEqual(submittedHash, configuredHash)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(adminSessionCookie, createAdminSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin",
    maxAge: adminSessionMaxAge,
  });
  return response;
}