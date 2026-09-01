"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * The delete-confirmation wiring shared by every admin list: pick a row, ask
 * for confirmation, call the row's own server action, then refresh.
 *
 * Originally written for the staff and sponsor tables; the player table had
 * its own copy of all three pieces below until this file pulled them out.
 */
export function useDeleteFlow(action: (id: string) => Promise<{ ok: boolean; message?: string }>) {
  const router = useRouter();
  const [target, setTarget] = useState<{ id: string; name: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    if (!target) return;
    const current = target;
    startTransition(async () => {
      const result = await action(current.id);
      if (result.ok) {
        toast.success(result.message ?? "Removed.");
        setTarget(null);
        router.refresh();
      } else {
        toast.error(result.message ?? "Could not delete.");
      }
    });
  }

  return { target, setTarget, isPending, confirm };
}

export function EmptyState({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
      <p className="mb-1 font-display text-lg font-bold uppercase">{title}</p>
      <p className="mb-5 text-sm text-muted-foreground">{body}</p>
      <Button asChild variant="lime">
        <Link href={href}>{cta}</Link>
      </Button>
    </div>
  );
}

export function DeleteDialog({
  target,
  onOpenChange,
  onConfirm,
  isPending,
  noun,
  extra,
  hasImage = true,
}: {
  target: { name: string } | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  noun: string;
  /** Extra context appended below the standard warning — e.g. the player
   * table's note that match history is never rewritten. */
  extra?: React.ReactNode;
  /** False for entities with no uploaded image, e.g. a match — omits that line. */
  hasImage?: boolean;
}) {
  return (
    <AlertDialog open={target !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {noun}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{target?.name}</strong>?
            {hasImage ? " The uploaded image is removed too." : ""} This action cannot be undone.
            {extra ? <span className="mt-2 block">{extra}</span> : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(event) => {
              event.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
