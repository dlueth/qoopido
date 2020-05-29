import { isFunction, isObject } from "@qoopido/validator";
import forEach from "./forEach";
import global from "../constant/global";
import uuid from "./uuid";

let strategy;

if ("setImmediate" in global && isFunction(setImmediate)) {
    strategy = setImmediate;
} else if (
    "MutationObserver" in global &&
    "document" in global &&
    isFunction(MutationObserver) &&
    isObject(document)
) {
    (function () {
        const storage = {};
        const element = document.createElement("div");
        const observer = new MutationObserver(function (records) {
            forEach(function (record) {
                const id = record.attributeName.substr(1);

                storage[id]();

                delete storage[id];
            });
        });

        observer.observe(element, { attributes: true });

        strategy = function (callback) {
            const id = uuid();

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
