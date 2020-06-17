/**
 * Check if value is a positive integer
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isPositiveInteger(value) {
    return 0 === value % (!isNaN(parseFloat(value)) && 0 <= ~~value);
}
