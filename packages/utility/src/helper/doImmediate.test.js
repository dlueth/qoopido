const _setImmediate = globalThis.setImmediate || globalThis.setTimeout;
const _MutationObserver = globalThis.MutationObserver;
const _document = globalThis.document;

describe("doImmediate()", () => {
    beforeEach(() => {
        jest.resetModules();

        globalThis.setImmediate = _setImmediate;
        globalThis.MutationObserver = _MutationObserver;
        globalThis.document = _document;
    });

    test("should successfully call the callback (setImmediate)", () => {
        return new Promise((resolve, reject) => {
            globalThis.MutationObserver = undefined;
            globalThis.document = undefined;

            const doImmediate = require("./doImmediate").default;
            const callback = jest.fn();

            doImmediate(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should successfully call the callback (MutationObserver)", () => {
        return new Promise((resolve, reject) => {
            globalThis.setImmediate = undefined;

            const doImmediate = require("./doImmediate").default;
            const callback = jest.fn();

            doImmediate(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

    test("should successfully call the callback (setTimeout)", () => {
        return new Promise((resolve, reject) => {
            globalThis.setImmediate = undefined;
            globalThis.MutationObserver = undefined;
            globalThis.document = undefined;

            const doImmediate = require("./doImmediate").default;
            const callback = jest.fn();

            doImmediate(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });
});
