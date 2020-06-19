/**
 * Check if value is transferable
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isTransferable(value) {
    return (
        value instanceof ArrayBuffer ||
        value instanceof MessagePort ||
        ("ImageBitmap" in self && value instanceof ImageBitmap)
    );
}
