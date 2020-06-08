import hash from "./hash";

describe("hash()", () => {
    test("should create the same hash for the same input", () => {
        const now = performance.now().toString();
        const result = hash(now);

        expect(hash(now)).toBe(result);
    });

    test("should create different hashes for different input", () => {
        const now = performance.now().toString();
        const result = hash(now);

        expect(hash(performance.now().toString())).not.toBe(result);
    });
});
