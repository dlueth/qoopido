import resolveId from "./id";

describe("resolveId()", () => {
    test("should return correct IDs for all kinds of valid input", () => {
        expect(resolveId("@test/resolveId")).toBe("module!@test/resolveId");
        expect(resolveId("internal!@test/resolveId")).toBe(
            "internal!@test/resolveId"
        );
        expect(resolveId("mock:internal!@test/resolveId")).toBe(
            "mock:internal!@test/resolveId"
        );
        expect(resolveId("mock:module!@test/resolveId")).toBe(
            "mock:module!@test/resolveId"
        );
        expect(resolveId("text!@test/resolveId")).toBe("text!@test/resolveId");
        expect(resolveId("text#6400!@test/resolveId")).toBe(
            "text!@test/resolveId"
        );
        expect(resolveId("text@3.2.0#6400!@test/resolveId")).toBe(
            "text!@test/resolveId"
        );
        expect(resolveId("./test/resolveId", "/test/path")).toBe(
            "module!/test/test/resolveId"
        );
    });
});
