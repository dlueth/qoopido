const matchToken = /[xy]/g;

/**
 * Randomize UUID-characters
 *
 * @param {String} character
 *
 * @returns {String}
 *
 * @ignore
 */
function randomize(token) {
    const r = (Math.random() * 16) | 0;

    return (token === "x" ? r : (r & 0x3) | 0x8).toString(16);
}

/**
 * Generate a pseudo unique UUIDv4
 *
 * @returns {String}
 */
export default function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        matchToken,
        randomize
    );
}
