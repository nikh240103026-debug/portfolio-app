import { NextResponse } from "next/server";
import { z } from "zod";

import { getPortfolioAnswer } from "@/lib/ai";

const messageSchema = z.object({
  message: z.string().trim().min(1).max(1000),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a valid JSON request." }, { status: 400 });
  }

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a message of 1 to 1000 characters." },
      { status: 400 },
    );
  }

  try {
    const answer = await getPortfolioAnswer(parsed.data.message);
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { error: "The chatbot could not answer that request right now." },
      { status: 500 },
    );
  }
}
