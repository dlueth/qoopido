import { isFunction, isObject } from "@qoopido/validator";
import uuid from "./uuid";

var strategy;

if (isFunction(setImmediate)) {
    strategy = setImmediate;
} else if (isFunction(MutationObserver) && isObject(document)) {
    (function () {
        var storage = {},
            element = document.createElement("div"),
            observer = new MutationObserver(function (records) {
                records.forEach(function (record) {
                    var id = record.attributeName.substr(1);

                    storage[id]();
                    delete storage[id];
                });
            });

        observer.observe(element, { attributes: true });

        strategy = function (callback) {
            var id = uuid();

            storage[id] = callback;

            element.setAttribute("i" + id, 1);
        };
    })();
} else {
    strategy = setTimeout;
}

/**
 * Immediately xecute a callback function, yet still deferred
 *
 * @param {Function} callback
 */
export default function doImmediate(callback) {
    strategy(callback);
}
