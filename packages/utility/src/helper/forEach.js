/**
 * Iterate over enumerable & own properties of an array/object
 *
 * @param {Iterable} source
 * @param {Function} callback
 * @param {*} [context]
 *
 * @returns {*}
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

    return context || source;
}
