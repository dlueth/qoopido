import isTypeof from "./isTypeof";
import isInstanceof from "./isInstanceof";

/**
 * Check if value is a string
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isString(value) {
    return isTypeof(value, "string") || isInstanceof(value, String);
}
