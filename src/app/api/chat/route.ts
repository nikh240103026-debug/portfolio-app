import { NextResponse } from "next/server";

import { getPortfolioAnswer } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { message?: string };
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "A message is required." }, { status: 400 });
    }

    const answer = await getPortfolioAnswer(message);
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { error: "The chatbot could not answer that request right now." },
      { status: 500 },
    );
  }
}
