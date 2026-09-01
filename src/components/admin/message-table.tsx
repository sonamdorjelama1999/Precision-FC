"use client";

import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { DeleteDialog, EmptyState, useDeleteFlow } from "@/components/admin/admin-table-kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteMessage, markMessageRead } from "@/features/contact/actions";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/format";
import { CONTACT_REASON_LABEL, type ContactMessage } from "@/types";

export function MessageTable({ messages }: { messages: ContactMessage[] }) {
  const { target, setTarget, isPending, confirm } = useDeleteFlow(deleteMessage);
  const router = useRouter();
  const [isToggling, startToggle] = useTransition();

  function toggleRead(message: ContactMessage) {
    startToggle(async () => {
      const result = await markMessageRead(message.id, !message.isRead);
      if (result.ok) router.refresh();
      else toast.error(result.message ?? "Could not update the message.");
    });
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        title="No messages yet"
        body="Submissions from the public Contact page show up here."
        href="/contact"
        cta="View Contact page"
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>From</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="hidden md:table-cell">Received</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow
                key={message.id}
                className={cn(!message.isRead && "bg-teal-dark/5")}
              >
                <TableCell>
                  {message.isRead ? null : (
                    <span className="block size-2 rounded-full bg-lime" aria-label="Unread" />
                  )}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{message.name}</span>
                  <a
                    href={`mailto:${message.email}`}
                    className="block text-xs text-teal-dark hover:underline"
                  >
                    {message.email}
                  </a>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{CONTACT_REASON_LABEL[message.reason]}</Badge>
                </TableCell>
                <TableCell className="max-w-[320px]">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{message.message}</p>
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {formatShortDate(message.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={message.isRead ? "Mark unread" : "Mark read"}
                      disabled={isToggling}
                      onClick={() => toggleRead(message)}
                    >
                      {message.isRead ? (
                        <MailOpen className="size-4" />
                      ) : (
                        <Mail className="size-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete message from ${message.name}`}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() =>
                        setTarget({ id: message.id, name: `${message.name}'s message` })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteDialog
        target={target}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirm}
        isPending={isPending}
        noun="message"
        hasImage={false}
      />
    </>
  );
}
