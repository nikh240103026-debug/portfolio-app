"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, LogOut, Mail, RefreshCw, Send } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type InboxMessage = {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  subject: string;
  message: string;
  organization: string | null;
  budgetRange: string | null;
  timeline: string | null;
  responseText: string | null;
  createdAt: string;
  respondedAt: string | null;
  status: string;
};

type InboxMode = "checking" | "login" | "inbox" | "error";

const statusStyle: Record<string, string> = {
  new: "text-cyan-300",
  read: "text-slate-400",
  draft: "text-amber-300",
  replied: "text-emerald-300",
};

function AdminHeader({ children }: { children: ReactNode }) {
  return (
    <header className="ibm-header sticky top-0 z-50">
      <div className="ibm-header-inner">
        <Link href="/" className="ibm-brand" aria-label="Nikhil Raj portfolio home">
          <span className="ibm-brand-mark">N</span>
          <span className="ibm-brand-name">Nikhil Raj</span>
        </Link>
        <div className="ibm-actions">{children}</div>
      </div>
    </header>
  );
}

async function fetchInbox() {
  const response = await fetch("/api/admin/messages", { cache: "no-store" });
  const data = await response.json();
  return { response, data };
}

export function AdminInbox() {
  const [mode, setMode] = useState<InboxMode>("checking");
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [password, setPassword] = useState("");
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchInbox().then(({ response, data }) => {
      if (cancelled) return;
      if (response.ok) {
        setMessages(data.messages);
        setSelectedId(data.messages[0]?.id ?? "");
        setReplyText(data.messages[0]?.responseText ?? "");
        setMode("inbox");
      } else if (response.status === 401) {
        setMode("login");
      } else {
        setError(data.error ?? "Unable to load the inbox.");
        setMode("error");
      }
    }).catch(() => {
      if (!cancelled) {
        setError("Unable to connect to the inbox.");
        setMode("error");
      }
    });
    return () => { cancelled = true; };
  }, []);

  const selectedMessage = messages.find((message) => message.id === selectedId) ?? null;
  const visibleMessages = messages.filter((message) => filter === "all" || message.status === filter);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to sign in.");
      const inbox = await fetchInbox();
      if (!inbox.response.ok) throw new Error(inbox.data.error ?? "Unable to load the inbox.");
      setMessages(inbox.data.messages);
      setSelectedId(inbox.data.messages[0]?.id ?? "");
      setReplyText(inbox.data.messages[0]?.responseText ?? "");
      setPassword("");
      setMode("inbox");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
    } finally {
      setIsBusy(false);
    }
  };

  const refreshInbox = async () => {
    setIsBusy(true);
    setError("");
    try {
      const result = await fetchInbox();
      if (!result.response.ok) throw new Error(result.data.error ?? "Unable to refresh the inbox.");
      setMessages(result.data.messages);
      if (!result.data.messages.some((message: InboxMessage) => message.id === selectedId)) {
        setSelectedId(result.data.messages[0]?.id ?? "");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to refresh the inbox.");
    } finally {
      setIsBusy(false);
    }
  };

  const updateMessage = async (updates: { status?: string; responseText?: string }) => {
    if (!selectedMessage) return;
    setIsBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedMessage.id, ...updates }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to update this message.");
      setMessages((current) => current.map((message) => message.id === data.message.id ? data.message : message));
      setReplyText(data.message.responseText ?? "");
      setNotice("Message updated.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update this message.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setMessages([]);
    setSelectedId("");
    setMode("login");
  };

  const replyHref = selectedMessage && replyText.trim()
    ? `mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}&body=${encodeURIComponent(replyText)}`
    : undefined;

  if (mode === "checking") {
    return (
      <div className="ibm-landing admin-page min-h-screen">
        <AdminHeader><span className="admin-header-label">Admin workspace</span></AdminHeader>
        <main className="ibm-main px-6 py-16 text-slate-600">Loading inbox...</main>
      </div>
    );
  }

  if (mode === "login" || mode === "error") {
    return (
      <div className="ibm-landing admin-page min-h-screen">
        <AdminHeader>
          <Link href="/" className="admin-home-link">Portfolio home</Link>
        </AdminHeader>
        <main className="ibm-main admin-login-main">
          <section className="admin-login-layout">
            <div className="admin-login-copy">
              <p className="ibm-eyebrow">Private workspace</p>
              <h1 className="admin-login-title">Contact inbox</h1>
              <p className="admin-login-summary">A focused place to review incoming messages and keep conversations moving.</p>
            </div>
            <div className="admin-login-panel">
              <p className="admin-panel-eyebrow">Admin access</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#161616]">Sign in</h2>
          {mode === "error" ? (
            <div role="alert" className="mt-5 border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</div>
          ) : (
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <label className="block text-sm text-slate-600">
                Admin password
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full border border-black/20 bg-white px-3 py-3 text-[#161616] outline-none focus:border-sky-400/50"
                />
              </label>
              {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}
              <button type="submit" disabled={isBusy} className="ibm-primary-cta w-full disabled:opacity-50">
                {isBusy ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}
              <p className="mt-5 text-xs leading-5 text-slate-500">This area is only available to the site administrator.</p>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="ibm-landing admin-page min-h-screen">
      <AdminHeader>
        <button onClick={() => void refreshInbox()} disabled={isBusy} aria-label="Refresh inbox" title="Refresh inbox" className="admin-icon-button disabled:opacity-50">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => void handleLogout()} className="admin-secondary-button">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
      </AdminHeader>

      <div className="admin-inbox-layout grid min-h-[calc(100vh-78px)] lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="border-b border-white/10 lg:border-b-0 lg:border-r">
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3">
            {["all", "new", "read", "draft", "replied"].map((value) => (
              <button key={value} onClick={() => setFilter(value)} className={`px-2 py-1 text-xs capitalize ${filter === value ? "text-sky-300" : "text-slate-400 hover:text-white"}`}>
                {value}
              </button>
            ))}
          </div>
          <div className="max-h-[45vh] overflow-y-auto lg:max-h-[calc(100vh-130px)]">
            {visibleMessages.map((message) => (
              <button
                key={message.id}
                onClick={() => { setSelectedId(message.id); setReplyText(message.responseText ?? ""); setNotice(""); }}
                className={`block w-full border-b border-white/10 px-5 py-4 text-left transition-colors ${message.id === selectedId ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <div className="flex justify-between gap-3">
                  <span className="truncate font-medium">{message.name}</span>
                  <span className={`text-[10px] uppercase ${statusStyle[message.status] ?? "text-slate-400"}`}>{message.status}</span>
                </div>
                <span className="mt-1 block truncate text-sm text-slate-300">{message.subject}</span>
                <span className="mt-1 block text-xs text-slate-500">{new Date(message.createdAt).toLocaleDateString()}</span>
              </button>
            ))}
            {visibleMessages.length === 0 ? <p className="px-5 py-8 text-sm text-slate-500">No messages in this view.</p> : null}
          </div>
        </aside>

        <section className="min-w-0 px-5 py-7 sm:px-8">
          {error ? <div role="alert" className="mb-5 border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</div> : null}
          {notice ? <div role="status" className="mb-5 border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-200">{notice}</div> : null}
          {selectedMessage ? (
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-300">{selectedMessage.inquiryType}</p>
                  <h2 className="mt-2 text-2xl font-semibold">{selectedMessage.subject}</h2>
                  <p className="mt-2 text-sm text-slate-400">{selectedMessage.name} · <a className="text-slate-200 hover:text-sky-300" href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a></p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedMessage.status === "new" ? (
                    <button onClick={() => void updateMessage({ status: "read" })} disabled={isBusy} className="border border-white/15 px-3 py-2 text-xs hover:border-sky-300 hover:text-sky-300 disabled:opacity-50">
                      Mark read
                    </button>
                  ) : null}
                  <p className="text-xs text-slate-500">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <dl className="grid gap-x-6 gap-y-3 border-b border-white/10 py-5 text-sm sm:grid-cols-3">
                {selectedMessage.organization ? <div><dt className="text-slate-500">Organization</dt><dd className="mt-1">{selectedMessage.organization}</dd></div> : null}
                {selectedMessage.budgetRange ? <div><dt className="text-slate-500">Budget</dt><dd className="mt-1">{selectedMessage.budgetRange}</dd></div> : null}
                {selectedMessage.timeline ? <div><dt className="text-slate-500">Timeline</dt><dd className="mt-1">{selectedMessage.timeline}</dd></div> : null}
              </dl>

              <div className="whitespace-pre-wrap py-6 text-sm leading-7 text-slate-200">{selectedMessage.message}</div>

              <div className="border-t border-white/10 pt-5">
                <label className="block text-sm font-medium text-slate-200" htmlFor="reply-message">Reply draft</label>
                <textarea
                  id="reply-message"
                  rows={6}
                  maxLength={5000}
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  className="mt-2 w-full border border-white/10 bg-slate-900 px-3 py-3 text-sm leading-6 text-white outline-none focus:border-sky-400/50"
                  placeholder="Write a response..."
                />
                <div className="mt-3 flex flex-wrap gap-3">
                  <button onClick={() => void updateMessage({ responseText: replyText.trim(), status: "draft" })} disabled={isBusy || !replyText.trim()} className="inline-flex items-center gap-2 bg-sky-400 px-4 py-2.5 text-sm font-medium text-slate-950 disabled:opacity-50">
                    <Check className="h-4 w-4" /> Save reply
                  </button>
                  {replyHref && selectedMessage.responseText ? (
                    <a href={replyHref} className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 text-sm hover:border-sky-300 hover:text-sky-300">
                      <Mail className="h-4 w-4" /> Open email draft
                    </a>
                  ) : null}
                  {selectedMessage.responseText && selectedMessage.status !== "replied" ? (
                    <button onClick={() => void updateMessage({ status: "replied" })} disabled={isBusy} className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 text-sm hover:border-emerald-300 hover:text-emerald-300 disabled:opacity-50">
                      <Send className="h-4 w-4" /> Mark as replied
                    </button>
                  ) : null}
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">Replies are saved here. Open the email draft to send from your mail app, then mark the message as replied.</p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">Select a message to review.</div>
          )}
        </section>
      </div>
    </div>
  );
}