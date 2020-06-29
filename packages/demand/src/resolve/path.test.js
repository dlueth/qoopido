import resolvePath from "./path";

describe("resolvePath()", () => {
    test("should return correct paths for all kinds of valid input", () => {
        expect(resolvePath("@test/resolveId")).toBe("@test/resolveId");
        expect(resolvePath("internal!@test/resolveId")).toBe("@test/resolveId");
        expect(resolvePath("mock:internal!@test/resolveId")).toBe(
            "@test/resolveId"
        );
        expect(resolvePath("mock:module!@test/resolveId")).toBe(
            "@test/resolveId"
        );
        expect(resolvePath("text!@test/resolveId")).toBe("@test/resolveId");
        expect(resolvePath("text#6400!@test/resolveId")).toBe(
            "@test/resolveId"
        );
        expect(resolvePath("text@3.2.0#6400!@test/resolveId")).toBe(
            "@test/resolveId"
        );
        expect(resolvePath("./resolveId")).toBe("resolveId");
        expect(resolvePath("./resolveId", "/test/path")).toBe(
            "/test/resolveId"
        );
        expect(resolvePath("../resolveId", "/test/path")).toBe("/resolveId");
    });
});
