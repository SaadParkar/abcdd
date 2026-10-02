export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function normalizeShift(shift: number) {
  return ((Math.round(shift) % 26) + 26) % 26;
}

export function shiftText(text: string, shift: number, decode = false) {
  const offset = normalizeShift(decode ? -shift : shift);
  return Array.from(text)
    .map((character) => {
      const code = character.charCodeAt(0);
      const isUppercase = code >= 65 && code <= 90;
      const isLowercase = code >= 97 && code <= 122;
      if (!isUppercase && !isLowercase) return character;
      const base = isUppercase ? 65 : 97;
      return String.fromCharCode(((code - base + offset) % 26) + base);
    })
    .join("");
}

export type ShiftStep = {
  char: string;
  isLetter: boolean;
  originalIndex?: number;
  shiftedIndex?: number;
  resultChar: string;
  formula?: string;
};

export function getShiftBreakdown(text: string, shift: number, decode = false): ShiftStep[] {
  const normShift = normalizeShift(shift);
  const offset = normalizeShift(decode ? -shift : shift);
  return Array.from(text).map((char) => {
    const code = char.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    if (!isUpper && !isLower) {
      return { char, isLetter: false, resultChar: char };
    }
    const base = isUpper ? 65 : 97;
    const originalIndex = code - base;
    const shiftedIndex = (originalIndex + offset) % 26;
    const resultChar = String.fromCharCode(shiftedIndex + base);
    const formula = decode
      ? `(${originalIndex} - ${normShift}) mod 26 = ${shiftedIndex}`
      : `(${originalIndex} + ${normShift}) mod 26 = ${shiftedIndex}`;
    return {
      char,
      isLetter: true,
      originalIndex,
      shiftedIndex,
      resultChar,
      formula,
    };
  });
}
