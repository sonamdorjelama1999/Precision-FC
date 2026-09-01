import { describe, expect, it } from "vitest";

import {
  combineDateAndTime,
  formatDate,
  formatDay,
  formatShortDate,
  formatTime,
  initials,
  signed,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/format";

/**
 * Every helper here formats explicitly off UTC getters rather than
 * toLocaleString, specifically so the result never depends on the machine
 * running it — these tests double as a guard against that regressing.
 */
describe("formatDate / formatShortDate", () => {
  it("renders a UTC date the same way regardless of local time zone", () => {
    const date = new Date(Date.UTC(2026, 4, 3)); // 3 May 2026
    expect(formatDate(date)).toBe("3 May 2026");
    expect(formatShortDate(date)).toBe("3 May 2026");
  });
});

describe("formatDay", () => {
  it("names the correct UTC weekday", () => {
    expect(formatDay(new Date(Date.UTC(2026, 4, 3)))).toBe("Sun");
    expect(formatDay(new Date(Date.UTC(2026, 4, 4)))).toBe("Mon");
  });
});

describe("formatTime", () => {
  it("formats a morning time with AM", () => {
    expect(formatTime(new Date(Date.UTC(2026, 0, 1, 9, 5)))).toBe("9:05 AM");
  });

  it("formats an afternoon time with PM and 12-hour rollover", () => {
    expect(formatTime(new Date(Date.UTC(2026, 0, 1, 18, 30)))).toBe("6:30 PM");
  });

  it("formats midnight and noon as 12, not 0", () => {
    expect(formatTime(new Date(Date.UTC(2026, 0, 1, 0, 0)))).toBe("12:00 AM");
    expect(formatTime(new Date(Date.UTC(2026, 0, 1, 12, 0)))).toBe("12:00 PM");
  });
});

describe("toDateInputValue / toTimeInputValue / combineDateAndTime", () => {
  it("round-trips a date through the input-value helpers", () => {
    const original = new Date(Date.UTC(2026, 8, 1, 18, 30));
    const dateValue = toDateInputValue(original);
    const timeValue = toTimeInputValue(original);

    expect(dateValue).toBe("2026-09-01");
    expect(timeValue).toBe("18:30");
    expect(combineDateAndTime(dateValue, timeValue).getTime()).toBe(original.getTime());
  });
});

describe("initials", () => {
  it("takes the first letter of up to two words", () => {
    expect(initials("Sudip Shrestha")).toBe("SS");
    expect(initials("Madonna")).toBe("M");
    expect(initials("  ")).toBe("");
  });

  it("ignores a third and later word", () => {
    expect(initials("Ram Bahadur Thapa")).toBe("RB");
  });
});

describe("signed", () => {
  it("prefixes a plus sign only for positive numbers", () => {
    expect(signed(4)).toBe("+4");
    expect(signed(0)).toBe("0");
    expect(signed(-3)).toBe("-3");
  });
});
