/**
 * Hash a given string
 *
 * @param {String} value
 *
 * @returns {Number}
 */
export default function hash(value) {
    var hash = 5381,
        i = value.length;

    while (i) {
        hash = (hash * 33) ^ value.charCodeAt(--i);
    }

    return hash >>> 0;
}
