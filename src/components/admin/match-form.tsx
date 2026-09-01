"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TeamSelect } from "@/components/admin/team-select";
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
import { createMatch, updateMatch } from "@/features/matches/actions";
import { toDateInputValue, toTimeInputValue } from "@/lib/format";
import { matchFormSchema, type MatchFormValues } from "@/lib/validations/match.schema";
import {
  FIXTURE_STATUSES,
  FIXTURE_STATUS_LABEL,
  MATCH_TYPES,
  MATCH_TYPE_LABEL,
  type Match,
  type Team,
} from "@/types";

/**
 * One form for both scheduling a fixture and entering a result — the Status
 * field is what turns this from a fixture into a result, and picking
 * COMPLETED reveals the score inputs right there rather than opening a
 * separate dialog. There is no generic dialog primitive in this app yet
 * (only the delete-confirmation AlertDialog), so folding "enter result" into
 * the existing form avoids introducing a second one just for this.
 */
export function MatchForm({
  match,
  teams,
  primaryTeamId,
}: {
  match?: Match;
  teams: Pick<Team, "id" | "name" | "logoUrl" | "isPrimary">[];
  /** Preselects the home team when scheduling a new match — Precision FC is the home team by default. */
  primaryTeamId?: string;
}) {
  const router = useRouter();
  const isEdit = Boolean(match);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      homeTeamId: match?.homeTeamId ?? primaryTeamId ?? "",
      awayTeamId: match?.awayTeamId ?? "",
      date: match ? toDateInputValue(match.scheduledAt) : "",
      time: match ? toTimeInputValue(match.scheduledAt) : "",
      matchType: match?.matchType ?? "FRIENDLY",
      venue: match?.venue ?? "",
      competitionName: match?.competitionName ?? "",
      status: match?.status ?? "SCHEDULED",
      homeScore: match?.homeScore != null ? String(match.homeScore) : "",
      awayScore: match?.awayScore != null ? String(match.awayScore) : "",
      notes: match?.notes ?? "",
      isPublished: match?.isPublished ?? true,
    },
  });

  const homeTeamId = watch("homeTeamId");
  const awayTeamId = watch("awayTeamId");
  const matchType = watch("matchType");
  const status = watch("status");
  const isPublished = watch("isPublished");
  const isCompleted = status === "COMPLETED";

  async function onSubmit(values: MatchFormValues) {
    const formData = new FormData();
    formData.set("homeTeamId", values.homeTeamId);
    formData.set("awayTeamId", values.awayTeamId);
    formData.set("date", values.date);
    formData.set("time", values.time);
    formData.set("matchType", values.matchType);
    formData.set("venue", values.venue);
    formData.set("competitionName", values.competitionName);
    formData.set("status", values.status);
    formData.set("homeScore", values.homeScore);
    formData.set("awayScore", values.awayScore);
    formData.set("notes", values.notes);
    formData.set("isPublished", values.isPublished ? "true" : "false");

    const result = match ? await updateMatch(match.id, formData) : await createMatch(formData);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof MatchFormValues, { message });
        }
      }
      toast.error(result.message ?? "Something went wrong.");
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/admin/matches");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-3xl space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="homeTeamId">Home team</Label>
          <TeamSelect
            id="homeTeamId"
            teams={teams}
            value={homeTeamId}
            onValueChange={(value) => setValue("homeTeamId", value, { shouldValidate: true })}
            placeholder="Select the home team"
            disabledId={awayTeamId}
          />
          <input type="hidden" {...register("homeTeamId")} />
          {errors.homeTeamId ? (
            <p className="text-sm text-destructive">{errors.homeTeamId.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="awayTeamId">Away team</Label>
          <TeamSelect
            id="awayTeamId"
            teams={teams}
            value={awayTeamId}
            onValueChange={(value) => setValue("awayTeamId", value, { shouldValidate: true })}
            placeholder="Select the opponent"
            disabledId={homeTeamId}
          />
          <input type="hidden" {...register("awayTeamId")} />
          {errors.awayTeamId ? (
            <p className="text-sm text-destructive">{errors.awayTeamId.message}</p>
          ) : null}
          {teams.length < 2 ? (
            <p className="text-xs text-muted-foreground">
              Add an opponent under Team Management before scheduling a match.
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            aria-invalid={!!errors.date}
            {...register("date")}
          />
          {errors.date ? <p className="text-sm text-destructive">{errors.date.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Kick-off time</Label>
          <Input
            id="time"
            type="time"
            aria-invalid={!!errors.time}
            {...register("time")}
          />
          {errors.time ? <p className="text-sm text-destructive">{errors.time.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="matchType">Match type</Label>
          <Select
            value={matchType}
            onValueChange={(value) =>
              setValue("matchType", value as MatchFormValues["matchType"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="matchType">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {MATCH_TYPES.map((value) => (
                <SelectItem key={value} value={value}>
                  {MATCH_TYPE_LABEL[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("matchType")} />
          {errors.matchType ? (
            <p className="text-sm text-destructive">{errors.matchType.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) =>
              setValue("status", value as MatchFormValues["status"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              {FIXTURE_STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {FIXTURE_STATUS_LABEL[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...register("status")} />
        </div>
      </div>

      {isCompleted ? (
        <div className="grid gap-5 rounded-md border border-border bg-card p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="homeScore">Home score</Label>
            <Input
              id="homeScore"
              inputMode="numeric"
              placeholder="0"
              aria-invalid={!!errors.homeScore}
              {...register("homeScore")}
            />
            {errors.homeScore ? (
              <p className="text-sm text-destructive">{errors.homeScore.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="awayScore">Away score</Label>
            <Input
              id="awayScore"
              inputMode="numeric"
              placeholder="0"
              aria-invalid={!!errors.awayScore}
              {...register("awayScore")}
            />
            {errors.awayScore ? (
              <p className="text-sm text-destructive">{errors.awayScore.message}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="venue">
            Venue <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="venue" placeholder="e.g. Precision Futsal Arena" {...register("venue")} />
          {errors.venue ? <p className="text-sm text-destructive">{errors.venue.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="competitionName">
            Competition <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="competitionName"
            placeholder="e.g. Kathmandu Futsal League"
            {...register("competitionName")}
          />
          {errors.competitionName ? (
            <p className="text-sm text-destructive">{errors.competitionName.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">
          Notes <span className="text-muted-foreground">(optional)</span>
        </Label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Anything worth noting about this match"
          className="flex w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-invalid:border-destructive"
          aria-invalid={!!errors.notes}
          {...register("notes")}
        />
        {errors.notes ? <p className="text-sm text-destructive">{errors.notes.message}</p> : null}
      </div>

      <label className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-teal-dark"
          checked={isPublished}
          onChange={(event) => setValue("isPublished", event.target.checked)}
        />
        <span>
          <span className="block text-sm font-medium">Published</span>
          <span className="block text-sm text-muted-foreground">
            Shown on the public site. Uncheck to keep this match admin-only while it's still being
            worked out.
          </span>
        </span>
      </label>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button type="submit" variant="lime" disabled={isSubmitting || teams.length < 2}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : isEdit ? (
            "Save match"
          ) : (
            "Schedule match"
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/matches">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
