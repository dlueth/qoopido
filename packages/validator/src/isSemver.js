import isString from "./isString";

var regexMatchSemver = /^\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b$/i;

/**
 * Check if value is a valid version (according to semver 2.0.0)
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isObject(value) {
    return isString(value) && regexMatchSemver.test(value);
}
