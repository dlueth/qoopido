var weakmap = new WeakMap();

/**
 * Class Event
 *
 * @param {String} name
 * @param {Emitter} context
 */
function Event(name, context) {
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

Event.prototype = {
    /**
     * Cancel an events processing immediately
     */
    cancel: function cancel() {
        weakmap.get(this).isCanceled = true;
    },

    /**
     * Retrieve an events cancelation state
     *
     * @returns {Boolean}
     */
    get isCanceled() {
        return weakmap.get(this).isCanceled;
    },
};

export default Event;
