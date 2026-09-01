import type { Metadata } from "next";

import { MessageTable } from "@/components/admin/message-table";
import { getMessages } from "@/features/contact/queries";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await getMessages();
  const unread = messages.filter((message) => !message.isRead).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black uppercase tracking-[-0.02em]">Messages</h1>
        <p className="mt-2 text-muted-foreground">
          {messages.length} message{messages.length === 1 ? "" : "s"}
          {unread > 0 ? `, ${unread} unread` : ""} from the public Contact page.
        </p>
      </header>

      <MessageTable messages={messages} />
    </div>
  );
}
