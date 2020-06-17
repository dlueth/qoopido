import global from "../constant/global";

const requestIdleCallback =
    ("requestIdleCallback" in global && global.requestIdleCallback) ||
    requestIdleCallbackShim;

function requestIdleCallbackShim(callback, options) {
    const start = +new Date();

    return setTimeout(function () {
        callback({
            didTimeout: false,
            timeRemaining: function () {
                return Math.max(0, 50 - (+new Date() - start));
            },
        });
    }, options && options.timeout);
}

/**
 * Execute a callback function when system is idle
 *
 * @param {Function} callback
 * @param {Number}   timeout
 *
 * @returns {Number}
 */
export default function doIdle(callback, timeout) {
    return requestIdleCallback(callback, { timeout: timeout });
}
