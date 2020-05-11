/**
 * Check if value is of a certain type
 *
 * @param {*} value
 * @param {*} constructor
 *
 * @returns {Boolean}
 */
export default function isInstanceof(value, constructor) {
    return value instanceof constructor;
}
