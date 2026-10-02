import "server-only";

import { Resend } from "resend";

type ContactEmailMessage = {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
  organization: string | null;
  budgetRange: string | null;
  timeline: string | null;
};

const defaultReply =
  "Thanks for reaching out. Your message has been received, and I will review it and get back to you as soon as possible.";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatLines(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function extractEmailAddress(value: string | undefined) {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  const match = trimmed.match(/<([^>]+)>/);
  const candidate = match ? match[1] : trimmed;
  return candidate.replace(/^['"]|['"]$/g, "").trim();
}

function isPlaceholderAddress(value: string | undefined) {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  return normalized.includes("[add") || normalized.includes("example.com") || normalized.includes("your-inbox") || normalized.includes("replace-with");
}

function isPersonalEmailAddress(value: string | undefined) {
  if (!value) return true;
  return /@(gmail|hotmail|outlook|yahoo|icloud|protonmail|aol)\./i.test(value);
}

export async function sendContactEmails(message: ContactEmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const configuredFrom = process.env.CONTACT_FROM_EMAIL;
  const configuredNotificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  const senderEmail = extractEmailAddress(configuredFrom);
  const notificationEmail = extractEmailAddress(configuredNotificationEmail) || senderEmail;

  if (!apiKey?.trim()) {
    console.warn("Contact email automation is disabled; missing RESEND_API_KEY.");
    return;
  }

  if (!senderEmail || isPlaceholderAddress(senderEmail)) {
    console.warn("Contact email automation is disabled; missing or placeholder CONTACT_FROM_EMAIL.");
    return;
  }

  const fallbackFromAddress = isPersonalEmailAddress(senderEmail) ? "onboarding@resend.dev" : senderEmail;
  const from = configuredFrom?.includes("<") ? configuredFrom.replace(/<([^>]+)>/, `<${fallbackFromAddress}>`) : fallbackFromAddress;

  if (!notificationEmail || isPlaceholderAddress(notificationEmail)) {
    console.warn("Contact email automation is disabled; missing or placeholder CONTACT_NOTIFICATION_EMAIL.");
    return;
  }

  const resend = new Resend(apiKey);
  const replyMessage = process.env.CONTACT_AUTOREPLY_MESSAGE?.trim() || defaultReply;
  const subject = message.subject.replace(/[\r\n]+/g, " ").slice(0, 160);
  const detailRows = [
    ["Name", message.name],
    ["Email", message.email],
    ["Inquiry type", message.inquiryType],
    ["Organization", message.organization],
    ["Budget", message.budgetRange],
    ["Timeline", message.timeline],
    ["Subject", subject],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));
  const detailText = detailRows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const detailHtml = detailRows
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");

  if (fallbackFromAddress !== senderEmail) {
    console.info("Using Resend test sender while a personal email is configured for the contact form.");
  }

  const results = await Promise.allSettled([
    resend.emails.send({
      from,
      to: [message.email],
      subject: "We received your message",
      text: `Hello ${message.name},\n\n${replyMessage}`,
      html: `<p>Hello ${escapeHtml(message.name)},</p><p>${formatLines(replyMessage)}</p>`,
    }, { idempotencyKey: `contact-ack/${message.id}` }),
    resend.emails.send({
      from,
      to: [notificationEmail],
      replyTo: message.email,
      subject: `New contact request: ${subject}`,
      text: `${detailText}\n\nMessage:\n${message.message}`,
      html: `<h1>New contact request</h1>${detailHtml}<h2>Message</h2><p>${formatLines(message.message)}</p>`,
    }, { idempotencyKey: `contact-notification/${message.id}` }),
  ]);

  if (results.some((result) => result.status === "rejected" || Boolean(result.status === "fulfilled" && result.value.error))) {
    const errors = results.map((result) => {
      if (result.status === "rejected") {
        return String(result.reason);
      }
      return result.value.error?.message ?? "";
    }).filter(Boolean);
    console.error("One or more contact emails could not be delivered:", errors);
  }
}