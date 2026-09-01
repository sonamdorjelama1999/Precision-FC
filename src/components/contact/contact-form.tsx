"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createContactMessage } from "@/features/contact/actions";
import { contactFormSchema, type ContactFormValues } from "@/lib/validations/contact.schema";
import { CONTACT_REASON_LABEL, CONTACT_REASONS } from "@/types";

/**
 * The only public-facing form in the app — every other form here lives
 * behind requireAdmin(). Submission goes through createContactMessage,
 * which has no auth gate of its own; see the honeypot field below and the
 * comment on that action for how it stays spam-resistant without one.
 */
export function ContactForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", reason: "GENERAL", message: "" },
  });

  const reason = watch("reason");

  async function onSubmit(values: ContactFormValues) {
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("reason", values.reason);
    formData.set("message", values.message);

    const result = await createContactMessage(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ContactFormValues, { message });
        }
      }
      toast.error(result.message ?? "Something went wrong.");
      return;
    }

    toast.success(result.message ?? "Sent.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-5">
      {/* Honeypot: hidden from sighted users and out of the tab order, but
          still present for a bot that fills in every field it can find. */}
      <div className="absolute -left-[9999px] top-0" aria-hidden="true">
        <label htmlFor="website">Leave this field blank</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
          {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason</Label>
        <Select
          value={reason}
          onValueChange={(value) =>
            setValue("reason", value as ContactFormValues["reason"], { shouldValidate: true })
          }
        >
          <SelectTrigger id="reason" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONTACT_REASONS.map((value) => (
              <SelectItem key={value} value={value}>
                {CONTACT_REASON_LABEL[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:border-destructive"
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <Button type="submit" variant="lime" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
