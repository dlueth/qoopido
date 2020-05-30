const _requestIdleCallback = global.requestIdleCallback;
const _cancelIdleCallback = global.cancelIdleCallback;

describe("doImmediate()", () => {
    beforeEach(() => {
        jest.resetModules();

        global.requestIdleCallback = _requestIdleCallback;
        global.cancelIdleCallback = _cancelIdleCallback;
    });

    test("should successfully call the callback (native)", () => {
        const doIdle = require("../../dist/helper/doIdle");
        const callback = jest.fn();

        doIdle(callback);

        setTimeout(() => {
            try {
                expect(callback.mock.calls.length).toBe(1);

                resolve();
            } catch (error) {
                reject(error);
            }
        }, 50);
    });

    test("should successfully call the callback (setTimeout)", () => {
        global.requestIdleCallback = undefined;
        global.cancelIdleCallback = undefined;

        const doIdle = require("../../dist/helper/doIdle");
        const callback = jest.fn();

        doIdle(callback);

        setTimeout(() => {
            try {
                expect(callback.mock.calls.length).toBe(1);

                resolve();
            } catch (error) {
                reject(error);
            }
        }, 0);
    });

    /*
    test("should successfully call the callback (setImmediate)", () => {
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
        });
    });

    test("should successfully call the callback (MutationObserver)", () => {
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
        });
    });

    test("should successfully call the callback (setTimeout)", () => {
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
        });
    });
    */
});
