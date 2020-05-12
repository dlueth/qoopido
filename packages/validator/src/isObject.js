import isFalsy from "./isFalsy";
import isTypeof from "./isTypeof";

/**
 * Check if value is an object
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isObject(value) {
    return !isFalsy(value) && isTypeof(value, "object");
}
