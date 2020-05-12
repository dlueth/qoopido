import isArray from "./isArray";

/**
 * Check if value is falsy
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isFalsy(value) {
    // eslint-disable-next-line eqeqeq
    return !value || (!isArray(value) && (value == "" || value == 0));
}
