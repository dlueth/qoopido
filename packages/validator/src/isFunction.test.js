import isFunction from "./isFunction";

describe("isFunction()", () => {
    test("should return true for functions", () => {
        expect(isFunction(function () {})).toBe(true);
    });

    test("should return false for non-functions", () => {
        expect(isFunction()).toBe(false);
        expect(isFunction(null)).toBe(false);
        expect(isFunction({})).toBe(false);
        expect(isFunction("test")).toBe(false);
        expect(isFunction([])).toBe(false);
    });
});
