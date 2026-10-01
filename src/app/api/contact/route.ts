import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1),
  email: z.email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid name, email, subject, and message." },
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

    const contact = await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
      },
    });

    return NextResponse.json({ success: true, contact });
  } catch {
    return NextResponse.json(
      {
        error: "Your message could not be saved. Please try again later or contact Nikhil directly.",
      },
      { status: 500 },
    );
  }
}
