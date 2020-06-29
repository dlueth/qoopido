import Pattern from "./Pattern";

describe("Pattern()", () => {
    test("should return a `Pattern` when successful (single location)", () => {
        const assertion = {
            weight: 13,
            match: /^@test\/package/,
            location: ["https://localhost/@test/package"],
        };
        const pattern = new Pattern(
            "@test/package",
            "https://localhost/@test/package"
        );

        expect(pattern instanceof Pattern).toBe(true);
        expect(pattern).toEqual(assertion);
    });

    test("should return a `Pattern` when successful (multiple locations)", () => {
        const assertion = {
            weight: 13,
            match: /^@test\/package/,
            location: [
                "https://localhost/@test/package",
                "http://localhost/@test/package",
            ],
        };
        const pattern = new Pattern("@test/package", [
            "https://localhost/@test/package",
            "http://localhost/@test/package",
        ]);

        expect(pattern instanceof Pattern).toBe(true);
        expect(pattern).toEqual(assertion);
    });
});

describe("matches()", () => {
    test("should return true for paths matching", () => {
        const pattern = new Pattern(
            "@test/package",
            "https://localhost/@test/package"
        );

        expect(pattern.matches("@test/package")).toBe(true);
        expect(pattern.matches("@test/package/")).toBe(true);
        expect(pattern.matches("@test/package/index.js")).toBe(true);
    });

    test("should return false for paths not matching or invalid", () => {
        const pattern = new Pattern(
            "@test/package",
            "https://localhost/@test/package"
        );

        expect(pattern.matches()).toBe(false);
        expect(pattern.matches(false)).toBe(false);
        expect(pattern.matches(null)).toBe(false);
        expect(pattern.matches("")).toBe(false);
        expect(pattern.matches("not_matching")).toBe(false);
        expect(pattern.matches("test/package")).toBe(false);
        expect(pattern.matches("unknown@test/package")).toBe(false);
    });
});

describe("process()", () => {
    test("should return the complete URL to load", () => {
        const pattern = new Pattern("@test/package", [
            "https://localhost/@test/package",
            "https://localhost/backup/@test/package",
        ]);

        expect(pattern.process("@test/package", 0)).toBe(
            "https://localhost/@test/package"
        );
        expect(pattern.process("@test/package/index.js", 0)).toBe(
            "https://localhost/@test/package/index.js"
        );
        expect(pattern.process("@test/package", 1)).toBe(
            "https://localhost/backup/@test/package"
        );
        expect(pattern.process("@test/package/index.js", 1)).toBe(
            "https://localhost/backup/@test/package/index.js"
        );
    });

    test("should return undefined when path is invalid or index not given or invalid", () => {
        const pattern = new Pattern("@test/package", [
            "https://localhost/@test/package",
            "https://localhost/backup/@test/package",
        ]);

        expect(pattern.process(undefined, 0)).toBe(undefined);
        expect(pattern.process(false, 0)).toBe(undefined);
        expect(pattern.process(null, 0)).toBe(undefined);
        expect(pattern.process("", 0)).toBe(undefined);
        expect(pattern.process("not_matching", 0)).toBe(undefined);
        expect(pattern.process("test/package", 0)).toBe(undefined);
        expect(pattern.process("unknown@test/package", 0)).toBe(undefined);

        expect(pattern.process("@test/package")).toBe(undefined);
        expect(pattern.process("@test/package", false)).toBe(undefined);
        expect(pattern.process("@test/package", null)).toBe(undefined);
        expect(pattern.process("@test/package", "")).toBe(undefined);
        expect(pattern.process("@test/package", {})).toBe(undefined);
        expect(pattern.process("@test/package", [])).toBe(undefined);
        expect(pattern.process("@test/package", 99)).toBe(undefined);
    });
});
