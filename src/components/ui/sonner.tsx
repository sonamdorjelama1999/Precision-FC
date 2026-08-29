"use client";

import { Toaster as Sonner } from "sonner";

/**
 * Toast host. Rendered once in the root layout; any client component can call
 * toast() from "sonner" without further wiring.
 */
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "!bg-card !text-foreground !border-border !rounded-md !shadow-lg",
          description: "!text-muted-foreground",
          actionButton: "!bg-primary !text-primary-foreground",
        },
      }}
    />
  );
}
