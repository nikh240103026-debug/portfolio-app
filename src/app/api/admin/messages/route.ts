import { NextResponse } from "next/server";
import { z } from "zod";

import { hasAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  id: z.string().min(1).max(80),
  status: z.enum(["new", "read", "draft", "replied"]).optional(),
  responseText: z.string().trim().min(1).max(5000).optional(),
}).refine((value) => value.status !== undefined || value.responseText !== undefined);

export async function GET(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Sign in to view the inbox." }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "The contact inbox is unavailable." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  if (!hasAdminSession(request)) {
    return NextResponse.json({ error: "Sign in to update the inbox." }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Provide a valid message update." }, { status: 400 });
  }

  try {
    const current = await prisma.contactMessage.findUnique({
      where: { id: parsed.data.id },
      select: { responseText: true },
    });
    if (!current) {
      return NextResponse.json({ error: "Message not found." }, { status: 404 });
    }

    const responseText = parsed.data.responseText ?? current.responseText;
    if (parsed.data.status === "replied" && !responseText) {
      return NextResponse.json({ error: "Save a reply draft before marking this message replied." }, { status: 400 });
    }

    const message = await prisma.contactMessage.update({
      where: { id: parsed.data.id },
      data: {
        ...(parsed.data.responseText ? { responseText: parsed.data.responseText } : {}),
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.status === "replied" ? { respondedAt: new Date() } : {}),
        ...(parsed.data.status && parsed.data.status !== "replied" ? { respondedAt: null } : {}),
      },
    });

    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ error: "The message could not be updated." }, { status: 500 });
  }
}