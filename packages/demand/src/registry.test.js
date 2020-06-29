beforeEach(() => {
    jest.resetModules();
});

describe("set()", () => {
    test("should correctly set a value for a given key", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set("now", now);

        expect(registry.get("now")).toBe(now);
    });

    test("should not set a value for falsy keys", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set(undefined, now);
        registry.set(null, now);
        registry.set(false, now);
        registry.set("", now);

        expect(registry.get()).toEqual({});
    });

    test("should not set a value for non-string keys", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set({}, now);
        registry.set([], now);

        expect(registry.get()).toEqual({});
    });
});

describe("get()", () => {
    test("should correctly retrieve a value for a given key", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set("now", now);

        expect(registry.get("now")).toBe(now);
    });

    test("should return the whole registry for falsy or invalid keys", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set("now", now);
        registry.set("now2", now);

        expect(registry.get()).toEqual({ now: now, now2: now });
        expect(registry.get(null)).toEqual({ now: now, now2: now });
        expect(registry.get(false)).toEqual({ now: now, now2: now });
        expect(registry.get("")).toEqual({ now: now, now2: now });
        expect(registry.get({})).toEqual({ now: now, now2: now });
        expect(registry.get([])).toEqual({ now: now, now2: now });
    });

    test("should return undefined for non-existing keys", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set("now", now);

        expect(registry.get("than")).toBe(undefined);
    });
});

describe("remove()", () => {
    test("should correctly remove a given key", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set("now", now);
        registry.remove("now");

        expect(registry.get("now")).toBe(undefined);
    });

    test("should ignore falsy or invalid keys", () => {
        const now = performance.now();
        const registry = require("./registry").default;

        registry.set("now", now);
        registry.remove();
        registry.remove(null);
        registry.remove(false);
        registry.remove("");
        registry.remove({});
        registry.remove([]);

        expect(registry.get()).toEqual({ now: now });
    });
});
