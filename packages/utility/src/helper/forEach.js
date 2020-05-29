/**
 * Iterate over enumerable & own properties of an array/object
 *
 * @param {Object} source
 * @param {Function} callback
 * @param {*} [context]
 *
 * @return {Object}
 */
export default function forEach(source, callback, context) {
    const properties = Object.keys(source);

    let i = 0;
    let property;
    let isCanceled;

    for (; (property = properties[i]) !== void 0; i++) {
        callback.call(context, source[property], property, source, function () {
            isCanceled = true;
        });

        if (isCanceled) {
            break;
        }
    }

    return source;
}
