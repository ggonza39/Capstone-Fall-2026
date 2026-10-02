import { isValidZip } from "./validationHelpers.mjs";

describe("isValidZip", () => {
    test("accepts a valid 5-digit ZIP", () => {
        expect(isValidZip("30301")).toBe(true);
    });

    test("rejects a non-numeric ZIP", () => {
        expect(isValidZip("abcde")).toBe(false);
    });

    test("rejects a ZIP that is too short", () => {
        expect(isValidZip("123")).toBe(false);
    });

    test("rejects a missing ZIP", () => {
        expect(isValidZip(undefined)).toBe(false);
        expect(isValidZip(null)).toBe(false);
        expect(isValidZip("")).toBe(false);
    });
});
