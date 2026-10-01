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

export async function sendContactEmails(message: ContactEmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;

  if (!apiKey?.trim() || !from?.trim() || !notificationEmail?.trim()) {
    const missingSettings = [
      !apiKey?.trim() && "RESEND_API_KEY",
      !from?.trim() && "CONTACT_FROM_EMAIL",
      !notificationEmail?.trim() && "CONTACT_NOTIFICATION_EMAIL",
    ].filter((setting): setting is string => Boolean(setting));
    console.warn(`Contact email automation is disabled; missing ${missingSettings.join(", ")}.`);
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

  if (results.some((result) => result.status === "rejected" || result.value.error)) {
    const errors = results.map((result) =>
      result.status === "rejected" ? String(result.reason) : result.value.error?.message,
    ).filter(Boolean);
    console.error("One or more contact emails could not be delivered:", errors);
  }
}