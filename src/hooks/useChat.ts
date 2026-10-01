import { useState } from "react";

import type { ChatMessage } from "@/types/chatbot";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi, I’m Nikhil AI. Ask me about Nikhil’s education, skills, projects, or contact details.",
    },
  ]);

  return { messages, setMessages };
}
