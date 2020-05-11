import isInstanceof from "./isInstanceof";

/**
 * Check if value is a RegExp
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isRegExp(value) {
	return isInstanceof(value, RegExp);
}
