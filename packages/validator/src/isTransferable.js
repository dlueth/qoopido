/**
 * Check if value is transferable
 *
 * @param {*} value
 *
 * @returns {Boolean}
 */
export default function isTransferable(value) {
    return (
        ("ArrayBuffer" in self && value instanceof ArrayBuffer) ||
        ("MessagePort" in self && value instanceof MessagePort) ||
        ("ImageBitmap" in self && value instanceof ImageBitmap)
    );
}
