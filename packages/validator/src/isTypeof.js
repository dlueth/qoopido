/**
 * Check if value is of a certain type
 *
 * @param {*} value
 * @param {string} type
 *
 * @returns {Boolean}
 */
export default function isTypeof(value, type) {
	return typeof value === type;
}
