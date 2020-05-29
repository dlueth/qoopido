const weakmap = new WeakMap();

/**
 * Class Event
 *
 * @member {String} name
 * @member {*} context
 */
export default class Event {
    /**
     * Constructor
     *
     * @param {String} name
     * @param {*} context
     */
    constructor(name, context) {
        Object.defineProperty(this, "name", {
            value: name,
            enumerable: true,
            configurable: false,
            writable: false,
        });

        Object.defineProperty(this, "context", {
            value: context,
            enumerable: true,
            configurable: false,
            writable: false,
        });

        weakmap.set(this, { isCanceled: false });
    }

    /**
     * Retrieve an events cancelation state
     *
     * @returns {Boolean}
     */
    get isCanceled() {
        return weakmap.get(this).isCanceled;
    }

    /**
     * Cancel an events processing immediately
     */
    cancel() {
        weakmap.get(this).isCanceled = true;
    }
}
