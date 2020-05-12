import isFalsy from "./isFalsy";
import isFunction from "./isFunction";

/**
 * Check if value is thenable
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isThenable(value) {
    return !isFalsy(value) && isFunction(value.then);
}
