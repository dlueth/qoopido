const matchCharacters = /[xy]/g;

/**
 * Randomize UUID-characters
 *
 * @param {String} character
 *
 * @returns {String}
 *
 * @ignore
 */
function randomize(character) {
    const r = (Math.random() * 16) | 0;

    return (character === "x" ? r : (r & 0x3) | 0x8).toString(16);
}

/**
 * Generate a pseudo unique UUIDv4
 *
 * @returns {String}
 */
export default function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        matchCharacters,
        randomize
    );
}
