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
        return new Promise((resolve, reject) => {
            MutationObserver = undefined;
            document = undefined;

            const doImmediate = require("../../dist/helper/doImmediate");
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
            setImmediate = undefined;

            const doImmediate = require("../../dist/helper/doImmediate");
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
            setImmediate = undefined;
            MutationObserver = undefined;
            document = undefined;

            const doImmediate = require("../../dist/helper/doImmediate");
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
