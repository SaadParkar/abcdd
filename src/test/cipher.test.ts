import { describe, expect, it } from "vitest";

import { normalizeShift, shiftText } from "@/lib/cipher";

describe("Caesar cipher", () => {
  it("encodes with alphabet wrapping", () => expect(shiftText("XYZ", 3)).toBe("ABC"));
  it("decodes a shifted message", () => expect(shiftText("FDHVDU", 3, true)).toBe("CAESAR"));
  it("preserves punctuation and case", () => expect(shiftText("Ave, Roma!", 3)).toBe("Dyh, Urpd!"));
  it("normalizes every wheel position", () => {
    expect(Array.from({ length: 26 }, (_, index) => normalizeShift(index))).toEqual(
      Array.from({ length: 26 }, (_, index) => index),
    );
    expect(normalizeShift(26)).toBe(0);
    expect(normalizeShift(-1)).toBe(25);
  });
});
