import { isTypeof } from "@qoopido/validator";

var arrayPrototypeSlice = Array.prototype.slice;

/**
 * Convert an array-like-object to an array
 *
 * @param {*} arrayLikeObject
 *
 * @returns {*[]|undefined}
 */
export default function toArray(arrayLikeObject, start) {
    if (arrayLikeObject && !isTypeof(arrayLikeObject.length, "undefined")) {
        return arrayPrototypeSlice.call(arrayLikeObject, start || 0);
    }
}
