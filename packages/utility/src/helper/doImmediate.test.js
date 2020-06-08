import global from "../constant/global";

const _setImmediate = global.setImmediate;
const _MutationObserver = global.MutationObserver;
const _document = global.document;

describe("doImmediate()", () => {
    beforeEach(() => {
        jest.resetModules();

        global.setImmediate = _setImmediate;
        global.MutationObserver = _MutationObserver;
        global.document = _document;
    });

    test("should successfully call the callback (setImmediate)", () => {
        return new Promise((resolve, reject) => {
            global.MutationObserver = undefined;
            global.document = undefined;

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
            global.setImmediate = undefined;

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
            global.setImmediate = undefined;
            global.MutationObserver = undefined;
            global.document = undefined;

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
