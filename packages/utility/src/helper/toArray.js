import { isTypeof } from "@qoopido/validator";

const arrayPrototypeSlice = Array.prototype.slice;

/**
 * Convert an array-like-object to an array
 *
 * @param {*} arrayLikeObject
 * @param {number} [start]
 *
 * @returns {*[]|undefined}
 */
export default function toArray(arrayLikeObject, start) {
    if (arrayLikeObject && !isTypeof(arrayLikeObject.length, "undefined")) {
        return arrayPrototypeSlice.call(arrayLikeObject, start || 0);
    }
}
