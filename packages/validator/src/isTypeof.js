/**
 * Check if value is of a certain type
 *
 * @param {*} value
 * @param {String} type
 *
 * @returns {Boolean}
 */
export default function isTypeof(value, type) {
    return typeof value === type;
}
