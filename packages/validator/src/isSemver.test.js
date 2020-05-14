const isSemver = require("../dist/isSemver");

describe("isSemver()", () => {
    test("should return true for valid semver versions", () => {
        expect(isSemver("1.0.0")).toBe(true);
        expect(isSemver("1.1.85")).toBe(true);
        expect(isSemver("1.17.85")).toBe(true);
        expect(isSemver("1.17.85-rc")).toBe(true);
        expect(isSemver("1.17.85-beta")).toBe(true);
        expect(isSemver("1.17.85-rc.1")).toBe(true);
        expect(isSemver("1.17.85-rc.87")).toBe(true);
        expect(isSemver("2020.4.1086303")).toBe(true);
    });

    test("should return false for non-semver compatible versions", () => {
        expect(isSemver()).toBe(false);
        expect(isSemver(null)).toBe(false);
        expect(isSemver(false)).toBe(false);
        expect(isSemver("test")).toBe(false);
        expect(isSemver({})).toBe(false);
        expect(isSemver([])).toBe(false);
        expect(isSemver(function () {})).toBe(false);
        expect(isSemver(Number.NaN)).toBe(false);
    });
});
