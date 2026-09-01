import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("lowercases and hyphenates plain text", () => {
    expect(slugify("Match report: Precision FC 3-1 Yangrima FC")).toBe(
      "match-report-precision-fc-3-1-yangrima-fc",
    );
  });

  it("strips accents rather than dropping the letter", () => {
    expect(slugify("Clásico")).toBe("clasico");
    expect(slugify("Précision")).toBe("precision");
  });

  it("collapses repeated separators and trims leading/trailing hyphens", () => {
    expect(slugify("  -- Hello,   World! --  ")).toBe("hello-world");
  });

  it("returns an empty string for input with no letters or numbers", () => {
    expect(slugify("!!!")).toBe("");
  });
});
