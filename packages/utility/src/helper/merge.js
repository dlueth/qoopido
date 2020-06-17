import { isObject, isArray } from "@qoopido/validator";
import forEach from "./forEach";

/**
 * Handle merge object keys/values
 *
 * @param {*} value
 * @param {String} key
 *
 * @ignore
 */
function mergeKeys(value, key) {
    const target = this[key];

    if (value === undefined) {
        return;
    }

    if (isArray(value) && isArray(this[key])) {
        this[key] = target.concat(value);

        return;
    }

    if (isObject(value) && isObject(this[key])) {
        this[key] = merge(target, value);

        return;
    }

    this[key] = value;
}

/**
 * Deep-merge any number of given objects modifying the first
 *
 * @param {Object}    target
 * @param {...Object} objects
 *
 * @returns {Object}
 */
export default function merge(target) {
    let i;
    let source;

    for (i = 1; (source = arguments[i]) !== undefined; i++) {
        forEach(source, mergeKeys, target);
    }

    return target;
}
