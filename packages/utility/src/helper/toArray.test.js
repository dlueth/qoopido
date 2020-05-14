const toArray = require("../../dist/helper/toArray");

describe("toArray()", () => {
    test("should fail silently for non array-like-objects", () => {
        expect(toArray({})).toBe(undefined);
    });

    test("should successfully convert array-like-objects to array", () => {
        const args = ["argument1", "argument2", "argument3"];

        expect(
            function () {
                return toArray(arguments);
            }.apply(null, args)
        ).toEqual(args);
    });

    test('should slice from "start" when passed', () => {
        const args = ["argument1", "argument2", "argument3"];

        expect(
            function () {
                return toArray(arguments, 1);
            }.apply(null, args)
        ).toEqual(args.slice(1));
    });
});
