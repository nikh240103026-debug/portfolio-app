import "server-only";

import { siteConfig } from "@/config/site";

const knowledgeBase = {
  name: "Nikhil Raj",
  education: "B.Tech Computer Science and Engineering at IIIT Manipur, specializing in Artificial Intelligence and Data Science.",
  program: "B.Tech Computer Science and Engineering",
  institute: "IIIT Manipur",
  specialization: "Artificial Intelligence and Data Science",
  currentYear: "3rd Year",
  focus: "AI, machine learning, data science, full-stack engineering, and systems-level software development.",
  skills:
    "C++, Python, JavaScript, TypeScript, React, Next.js, Node.js, PostgreSQL, PyTorch, NumPy, Pandas, Scikit-learn, OpenCV, and more.",
  projects: [
    "Quant-X",
    "Quantum Learning AI",
    "Fraud Transaction Detection",
    "Customer Segmentation System",
    "Loan Prediction",
    "Credit Default Risk",
    "Titanic Survival Predictor",
  ],
  technologies: [
    "C++",
    "Python",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "PostgreSQL",
    "NumPy",
    "Pandas",
    "Scikit-learn",
    "PyTorch",
    "OpenCV",
    "Matplotlib",
    "Plotly",
  ],
  contact: {
    email: siteConfig.email,
    phone: siteConfig.phone,
    github: siteConfig.social.github,
    linkedin: siteConfig.social.linkedin,
    instagram: siteConfig.social.instagram,
    youtube: siteConfig.social.youtube,
  },
  interests: "I work on real software systems, AI applications, data-driven products, and performance-oriented engineering challenges.",
  currentBuild: "I am actively building technical projects around AI, data systems, software engineering, and practical product development.",
};

const baseSystemPrompt = `You are Nikhil AI, a helpful assistant for Nikhil Raj's portfolio. Only answer using the provided portfolio knowledge base. If something is missing, say: "I don't have that information yet. You can contact Nikhil directly." Keep answers concise, accurate, and professional.`;

export async function getPortfolioAnswer(question: string): Promise<string> {
  const normalized = question.trim();

  if (!normalized) {
    return "Please ask me about Nikhil's education, projects, skills, experience, or contact details.";
  }

  const q = normalized.toLowerCase();

  if (/(who is nikhil|introduce nikhil|who is he|about nikhil)/.test(q)) {
    return `${knowledgeBase.name} is a 3rd-year Computer Science and Engineering student at IIIT Manipur specializing in Artificial Intelligence and Data Science. He builds software, AI systems, and data-driven applications with a focus on practical engineering.`;
  }

  if (/(what does he study|what does nikhil study|study|branch|program|degree|specializ)/.test(q)) {
    return `He is pursuing ${knowledgeBase.program} at ${knowledgeBase.institute}, with specialization in ${knowledgeBase.specialization}.`;
  }

  if (/(what projects|show me his projects|projects has he built|quant-x|quantum learning ai)/.test(q)) {
    return `His project work includes Quant-X, Quantum Learning AI, Fraud Transaction Detection, Customer Segmentation System, Loan Prediction, Credit Default Risk, and Titanic Survival Predictor.`;
  }

  if (/(quant-x|tell me about quant-x)/.test(q)) {
    return `Quant-X is a production-oriented C++ quantitative trading and high-performance matching engine project focused on low-latency systems, order books, market data, and matching engine logic.`;
  }

  if (/(what technologies|tech stack|what does he use|tools)/.test(q)) {
    return `He works with ${knowledgeBase.skills}`;
  }

  if (/(does he know c\+\+|c\+\+|python|typescript|next|react)/.test(q)) {
    return `Yes. Nikhil works with C++, Python, JavaScript, TypeScript, React, Next.js, PostgreSQL, and modern AI/data tools such as NumPy, Pandas, Scikit-learn, and PyTorch.`;
  }

  if (/(contact|how can i contact|email|phone|linkedin|github)/.test(q)) {
    return `You can reach out via email at ${siteConfig.email}, phone at ${siteConfig.phone}, GitHub at ${siteConfig.social.github}, or LinkedIn at ${siteConfig.social.linkedin}.`;
  }

  if (/(what is his specialization|specialization|current year)/.test(q)) {
    return `His specialization is ${knowledgeBase.specialization}, and he is currently in his 3rd year.`;
  }

  if (/(experience|journey|what is he building|currently building|learning)/.test(q)) {
    return `${knowledgeBase.currentBuild} He is also actively learning and improving in AI, ML, data systems, and product-oriented software engineering.`;
  }

  if (/(achievement|certification|award)/.test(q)) {
    return `The portfolio includes achievements and certifications sections with placeholders to be filled in as they become available.`;
  }

  if (process.env.AI_API_KEY && (process.env.AI_PROVIDER ?? "openai") === "openai") {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          messages: [
            { role: "system", content: baseSystemPrompt },
            { role: "system", content: `Portfolio info: ${JSON.stringify(knowledgeBase)}` },
            { role: "user", content: question },
          ],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };

        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          return content;
        }
      }
    } catch {
      // Fall through to the local knowledge base answer.
    }
  }

  return "I don't have that information yet. You can contact Nikhil directly.";
}
