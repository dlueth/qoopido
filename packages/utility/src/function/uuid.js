var matchCharacters = /[xy]/g;

/**
 * Randomize UUID-characters
 *
 * @param {string} character
 *
 * @returns {string}
 *
 * @ignore
 */
function randomize(character) {
    var r = (Math.random() * 16) | 0;

    return (character === "x" ? r : (r & 0x3) | 0x8).toString(16);
}

/**
 * Generate a pseudo unique UUIDv4
 *
 * @returns {string}
 */
export default function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        matchCharacters,
        randomize
    );
}
