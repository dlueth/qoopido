import isTypeof from "./isTypeof";

/**
 * Check if value is a function
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isFunction(value) {
	return isTypeof(value, "function");
}
