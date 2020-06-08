import isObject from "./isObject";

describe("isObject()", () => {
    test("should return true for any kind of object", () => {
        expect(isObject({})).toBe(true);
        expect(isObject([])).toBe(true);
        expect(isObject(new Error("test"))).toBe(true);
        expect(isObject(new String("test"))).toBe(true);
        expect(isObject(new Number(22))).toBe(true);
    });

    test("should return false for non-objects", () => {
        expect(isObject()).toBe(false);
        expect(isObject(function () {})).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject(0)).toBe(false);
        expect(isObject("test")).toBe(false);
        expect(isObject(String("test"))).toBe(false);
        expect(isObject(Number(22))).toBe(false);
        expect(isObject(Number.NaN)).toBe(false);
    });
});
