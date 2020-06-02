const _requestIdleCallback = global.requestIdleCallback;
const _cancelIdleCallback = global.cancelIdleCallback;

describe("doImmediate()", () => {
    beforeEach(() => {
        jest.resetModules();

        global.requestIdleCallback = _requestIdleCallback;
        global.cancelIdleCallback = _cancelIdleCallback;
    });

    test("should successfully call the callback (native)", () => {
        return new Promise((resolve, reject) => {
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
            }, 20);
        });
    });

    test("should successfully call the callback (setTimeout)", () => {
        return new Promise((resolve, reject) => {
            global.requestIdleCallback = undefined;
            global.cancelIdleCallback = undefined;

            const doIdle = require("../../dist/helper/doIdle");
            const callback = jest.fn();

            doIdle(callback);

            setTimeout(() => {
                try {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(typeof callback.mock.calls[0][0]).toBe('object');
                    expect(callback.mock.calls[0][0].didTimeout).toBe(false);
                    expect(typeof callback.mock.calls[0][0].timeRemaining).toBe('function');
                    expect(typeof callback.mock.calls[0][0].timeRemaining()).toBe('number');
                    expect(callback.mock.calls[0][0].timeRemaining()).toBeGreaterThanOrEqual(0);
                    expect(callback.mock.calls[0][0].timeRemaining()).toBeLessThanOrEqual(50);

                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 20);
        });
    });

});
