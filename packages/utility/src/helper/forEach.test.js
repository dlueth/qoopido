const forEach = require("../../dist/helper/forEach");

describe("forEach()", () => {
    test("should fail on invalid values", () => {
        const callback = jest.fn();

        expect(() => {
            forEach(void 0, callback);
        }).toThrow();
        expect(() => {
            forEach(null, callback);
        }).toThrow();
        expect(callback.mock.calls.length).toBe(0);
    });

    test("should fail on missing callback", () => {
        expect(() => {
            forEach([1]);
        }).toThrow();
    });

    test("should succeed on arrays", () => {
        const values = Array.from(
            { length: Math.max(2, Math.ceil(Math.random() * 40)) },
            () => Math.floor(Math.random() * 40)
        );

        const callback = jest.fn((item, key, source, cancel) => {
            source[key] = item.toString().split("").reverse().join("");
        });

        const result = forEach(values.slice(), callback);

        expect(callback.mock.calls.length).toBe(values.length);

        values.forEach((value, index) => {
            expect(result[index]).toBe(
                value.toString().split("").reverse().join("")
            );
        });
    });

    test("should succeed on objects", () => {
        const value = {
            first: Math.floor(Math.random() * 40),
            second: Math.floor(Math.random() * 40),
            third: Math.floor(Math.random() * 40),
        };

        const callback = jest.fn((item, key, source, cancel) => {
            source[key] = item.toString().split("").reverse().join("");
        });

        const result = forEach(Object.assign({}, value), callback);

        expect(callback.mock.calls.length).toBe(3);

        Object.keys(value).forEach((key) => {
            expect(result[key]).toBe(
                value[key].toString().split("").reverse().join("")
            );
        });
    });

    test("should successfully cancel", () => {
        const values = Array.from(
            { length: Math.max(2, Math.ceil(Math.random() * 40)) },
            () => Math.floor(Math.random() * 40)
        );

        const stop = Math.ceil(Math.random() * (values.length - 1));

        const callback = jest.fn((item, index, source, cancel) => {
            if (callback.mock.calls.length === stop) {
                cancel();
            }
        });

        forEach(values, callback);

        expect(callback.mock.calls.length).toBe(stop);
    });
});
