let _globalThis;
let _self;
let _global;

beforeEach(() => {
    jest.resetModules();

    _globalThis = globalThis;
    _self = self;
    _global = global;
});

afterEach(() => {
    globalThis = _globalThis;
    self = _self;
    global = _global;
});

describe("global", () => {
    test("should return `globalThis` if present and valid", () => {
        const result = require("./index").default;

        expect(result).toBe(global.globalThis);
    });

    test("should return `self if `globalThis` ìs present but invalid (case 1)", () => {
        globalThis.globalThis = undefined;

        const result = require("./index").default;

        expect(result).toBe(self);
    });

    test("should return `self if `globalThis` ìs present but invalid (case 2)", () => {
        globalThis = true;

        const result = require("./index").default;

        expect(result).toBe(self);
    });

    test("should return `self` if present and valid", () => {
        globalThis = undefined;

        const result = require("./index").default;

        expect(result).toBe(self);
    });

    test("should return `global` if `self` is present but invalid (case 1)", () => {
        globalThis = undefined;
        self.self = undefined;

        const result = require("./index").default;

        expect(result).toBe(global);
    });

    test("should return `global` if `self` is present but invalid (case 2)", () => {
        globalThis = undefined;
        self = true;

        const result = require("./index").default;

        expect(result).toBe(global);
    });

    test("should return `global` if present and valid", () => {
        globalThis = undefined;
        self = undefined;

        const result = require("./index").default;

        expect(result).toBe(global);
    });

    test("should return `this` if `global` is present but invalid (case 1)", () => {
        globalThis = undefined;
        self = undefined;
        global.global = undefined;

        const result = require("./index").default;

        expect(result).toBe(_globalThis);
    });

    test("should return `this` if `global` is present but invalid (case 2)", () => {
        globalThis = undefined;
        self = undefined;
        global = true;

        const result = require("./index").default;

        expect(result).toBe(_globalThis);
    });

    test("should return `this` if present and valid", () => {
        globalThis = undefined;
        self = undefined;
        global = undefined;

        const result = require("./index").default;

        expect(result).toBe(_globalThis);
    });
});
