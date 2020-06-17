import isPositiveInteger from "./isPositiveInteger";

describe("isPositiveInteger()", () => {
    test("should return true for valid values", () => {
        expect(isPositiveInteger(0)).toBe(true);
        expect(isPositiveInteger(23)).toBe(true);
        expect(isPositiveInteger(Number.MAX_VALUE)).toBe(true);
        expect(isPositiveInteger("1e10")).toBe(true);
    });

    test("should return false for non-valid valuess", () => {
        expect(isPositiveInteger()).toBe(false);
        expect(isPositiveInteger("")).toBe(false);
        expect(isPositiveInteger(" ")).toBe(false);
        expect(isPositiveInteger(-10)).toBe(false);
        expect(isPositiveInteger(10.3)).toBe(false);
        expect(isPositiveInteger(-40.1)).toBe(false);
        expect(isPositiveInteger("string")).toBe(false);
        expect(isPositiveInteger("-1e10")).toBe(false);
        expect(isPositiveInteger("1d10")).toBe(false);
    });
});
