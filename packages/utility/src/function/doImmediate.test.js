const _setImmediate = setImmediate;
const _MutationObserver = MutationObserver;
const _document = document;

describe("doImmediate()", () => {
    beforeEach(() => {
        jest.resetModules();

        setImmediate = _setImmediate;
        MutationObserver = _MutationObserver;
        document = _document;
    });

    test("should successfully call the callback (setImmediate)", () => {
        MutationObserver = undefined;
        document = undefined;

        const doImmediate = require("../../dist/function/doImmediate");
        const callback = jest.fn();

        doImmediate(callback);

        setTimeout(() => {
            try {
                expect(callback.mock.calls.length).toBe(1);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });

    test("should successfully call the callback (MutationObserver)", () => {
        setImmediate = undefined;

        const doImmediate = require("../../dist/function/doImmediate");
        var callback = jest.fn();

        doImmediate(callback);

        setTimeout(() => {
            try {
                expect(callback.mock.calls.length).toBe(1);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });

    test("should successfully call the callback (setTimeout)", () => {
        setImmediate = undefined;
        MutationObserver = undefined;
        document = undefined;

        const doImmediate = require("../../dist/function/doImmediate");
        var callback = jest.fn();

        doImmediate(callback);

        setTimeout(() => {
            try {
                expect(callback.mock.calls.length).toBe(1);

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
});
