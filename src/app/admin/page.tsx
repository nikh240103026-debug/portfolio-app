import type { Metadata } from "next";

import { AdminInbox } from "@/components/admin-inbox";

export const metadata: Metadata = {
  title: "Contact Inbox",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminInbox />;
}