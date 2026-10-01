import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  inquiryType: z.enum([
    "Project collaboration",
    "Freelance or contract",
    "Job opportunity",
    "Technical question",
    "Other",
  ]),
  subject: z.string().trim().min(3).max(160),
  message: z.string().trim().min(20).max(5000),
  organization: z.string().trim().max(120),
  budgetRange: z.enum(["Under INR 50,000", "INR 50,000-250,000", "INR 250,000+", "Not sure"]).or(z.literal("")),
  timeline: z.enum(["As soon as possible", "Within 1 month", "Within 3 months", "Flexible"]).or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please complete all required fields with valid information." },
        { status: 400 },
      );
    }

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error:
            "The database is not configured yet. Add DATABASE_URL in your environment to save contact submissions.",
        },
        { status: 503 },
      );
    }

    await prisma.contactMessage.create({ data: parsed.data });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error: "Your message could not be saved. Please try again later or contact Nikhil directly.",
      },
      { status: 500 },
    );
  }
}
