import { describe, expect, it } from "vitest";

import { contactFormSchema } from "@/lib/validations/contact.schema";
import { matchFormSchema, scoreToNumber } from "@/lib/validations/match.schema";
import { newsFormSchema } from "@/lib/validations/news.schema";

describe("newsFormSchema", () => {
  const valid = {
    title: "Match report: Precision FC 3-1 Yangrima FC",
    slug: "match-report-vs-yangrima",
    excerpt: "Precision FC beat Yangrima FC 3-1 at Rumble Futsal.",
    body: "It was a good win.",
    publishedAt: "2026-05-01",
    isPublished: true,
  };

  it("accepts a fully valid post", () => {
    expect(newsFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a slug with spaces or uppercase letters", () => {
    expect(newsFormSchema.safeParse({ ...valid, slug: "Match Report" }).success).toBe(false);
  });

  it("rejects a slug with a leading or trailing hyphen", () => {
    expect(newsFormSchema.safeParse({ ...valid, slug: "-match-report-" }).success).toBe(false);
  });

  it("requires a non-empty title", () => {
    expect(newsFormSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });
});

describe("matchFormSchema", () => {
  const valid = {
    homeTeamId: "team_home",
    awayTeamId: "team_away",
    date: "2026-06-01",
    time: "18:30",
    matchType: "FRIENDLY",
    venue: "Rumble Futsal",
    competitionName: "",
    status: "SCHEDULED",
    homeScore: "",
    awayScore: "",
    notes: "",
    isPublished: true,
  };

  it("accepts a valid scheduled fixture", () => {
    expect(matchFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects the same team on both sides", () => {
    const result = matchFormSchema.safeParse({ ...valid, awayTeamId: "team_home" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-numeric score", () => {
    const result = matchFormSchema.safeParse({
      ...valid,
      status: "COMPLETED",
      homeScore: "abc",
      awayScore: "1",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty score (not yet played)", () => {
    expect(matchFormSchema.safeParse(valid).success).toBe(true);
  });
});

describe("scoreToNumber", () => {
  it("turns an empty string into null", () => {
    expect(scoreToNumber("")).toBeNull();
  });

  it("turns a digit string into a number", () => {
    expect(scoreToNumber("3")).toBe(3);
  });
});

describe("contactFormSchema", () => {
  const valid = {
    name: "Bijay Lama",
    email: "bijay@example.com",
    reason: "GENERAL",
    message: "Interested in sponsoring the club this season.",
  };

  it("accepts a valid submission", () => {
    expect(contactFormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email address", () => {
    expect(contactFormSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    expect(contactFormSchema.safeParse({ ...valid, message: "too short" }).success).toBe(false);
  });

  it("rejects a reason outside the fixed set", () => {
    expect(contactFormSchema.safeParse({ ...valid, reason: "BILLING" }).success).toBe(false);
  });
});
