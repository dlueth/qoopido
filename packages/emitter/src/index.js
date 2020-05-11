import { toArray } from "@qoopido/utility";
import {
    isTypeof,
    isFunction,
    isString,
    isArray,
    isRegExp,
    isThenable,
} from "@qoopido/validator";
import Listener from "./class/listener";
import Event from "./class/event";
import { isIdentifier } from "./validator/index";

var weakmap = new WeakMap();

/**
 * Initialize a weakmap for a given context
 *
 * @param {Emitter} context
 *
 * @returns {Emitter}
 *
 * @ignore
 */
function initialize(context) {
    weakmap.set(context, {
        timestamp: +new Date(),
        events: {},
        expressions: [],
    });

    return context;
}

/**
 * Remove an event listener
 *
 * @param {Listener} listener
 * @param {Function} listener.callback
 *
 * @returns {Boolean}
 *
 * @ignore
 */
function filterRemoveEvent(listener) {
    return listener.callback !== this;
}

/**
 * Remove an expression listener
 *
 * @param {Listener} listener
 * @param {RegExp} listener.identifier
 * @param {Function} listener.callback
 *
 * @returns {Boolean}
 *
 * @ignore
 */
function filterRemoveExpression(listener) {
    return !(
        listener.identifier.toString() === this.identifier.toString() &&
        (isTypeof(this.callback, "undefined") ||
            listener.callback === this.callback)
    );
}

/**
 * Sort listener array
 *
 * @param {Object} a
 * @param {int} a.timestamp
 * @param {Object} b
 * @param {int} b.timestamp
 *
 * @returns {Number}
 *
 * @ignore
 */
function sortListener(a, b) {
    return a.timestamp - b.timestamp;
}

/**
 * Return a listeners callback
 *
 * @param {Listener} listener
 * @param {Function} listener.callback
 *
 * @returns {Function}
 *
 * @ignore
 */
function mapListener(listener) {
    return listener.callback;
}

/**
 * Apply an event + optional details to all listeners sequentually
 *
 * @param {Listener[]} listener
 * @param {Event} event
 * @param {*[]=} details
 *
 * @ignore
 */
function applyEvent(listener, event, details) {
    var self = this;

    listener.reduce(function (previous, next) {
        if (!event.isCanceled) {
            if (next.remaining && !(next.remaining -= 1)) {
                self.off(next.identifier, next.callback);
            }

            if (isThenable(previous)) {
                return previous.then(function () {
                    return next.callback.apply(this, [event].concat(details));
                });
            }

            return next.callback.apply(this, [event].concat(details));
        }
    }, true);
}

/**
 * Subscribe an event listener
 *
 * @param {String} name
 * @param {Function} callback
 * @param {Boolean=} prepend
 * @param {Number=} limit
 *
 * @ignore
 */
function subscribeEvent(name, callback, prepend, limit) {
    (this.events[name] = this.events[name] || []).push(
        new Listener(this, name, callback, prepend, limit)
    );
}

/**
 * Unregister an event listener
 *
 * @param {String} name
 * @param {Function} callback
 *
 * @ignore
 */
function unsubscribeEvent(name, callback) {
    if (!this.events[name]) {
        return;
    }

    if (callback) {
        this.events[name] = this.events[name].filter(
            filterRemoveEvent,
            callback
        );
    } else {
        this.events[name].length = 0;
    }
}

/**
 * Subscribe an expression listener
 *
 * @param {RegExp} expression
 * @param {Function} callback
 * @param {Boolean=} prepend
 * @param {Number=} limit
 *
 * @ignore
 */
function subscribeExpression(expression, callback, prepend, limit) {
    this.expressions.push(
        new Listener(this, expression, callback, prepend, limit)
    );
}

/**
 * Unsubscribe an expression listener
 *
 * @param {RegExp} expression
 * @param {Function} callback
 *
 * @ignore
 */
function unsubscribeExpression(expression, callback) {
    this.expressions = this.expressions.filter(filterRemoveExpression, {
        identifier: expression,
        callback: callback,
    });
}

/**
 * Retrieve all listeners for a certain event
 *
 * @param {String} name
 *
 * @returns {Listener[]}
 *
 * @ignore
 */
function retrieveListener(name) {
    var listener, storage;

    if (isString(name)) {
        storage = weakmap.get(this);
        listener = storage.events[name] ? storage.events[name].slice() : [];

        if (this !== Emitter) {
            listener = listener.concat(retrieveListener.call(Emitter, name));
        }

        storage.expressions.forEach((expression) => {
            if (expression.identifier.test(name)) {
                listener.push(expression);
            }
        });

        listener.sort(sortListener);
    }

    return listener || [];
}

/**
 * Class Emitter
 */
function Emitter() {
    initialize(this);
}

Emitter.prototype = {
    /**
     * Emit an event
     *
     * @param {String} name
     * @param {...*} details
     *
     * @returns {Emitter}
     */
    emit: function emit(name) {
        var details = toArray(arguments, 1),
            listener = retrieveListener.call(this, name);

        if (listener.length) {
            applyEvent.call(this, listener, new Event(name, this), details);
        }

        return this;
    },

    /**
     * Subscribe an event listener
     *
     * @param {String|RegExp|(String|RegExp)[]} identifier
     * @param {Function} callback
     * @param {Boolean=} prepend
     * @param {Number=} limit
     *
     * @returns {Emitter}
     */
    on: function on(identifier, callback, prepend, limit) {
        return Emitter.on.call(this, identifier, callback, prepend, limit);
    },

    /**
     * Subscribe a once only event listener
     *
     * @param {String|RegExp|(String|RegExp)[]} identifier
     * @param {Function} callback
     * @param {Boolean=} prepend
     *
     * @returns {Emitter}
     */
    once: function once(identifier, callback, prepend) {
        return Emitter.once.call(this, identifier, callback, prepend);
    },

    /**
     * Subscribe a limited event listener
     *
     * @param {String|RegExp|(String|RegExp)[]} identifier
     * @param {Number} limit
     * @param {Function} callback
     * @param {Boolean=} prepend
     *
     * @returns {Emitter}
     */
    limit: function limit(identifier, limit, callback, prepend) {
        return Emitter.limit.call(this, identifier, limit, callback, prepend);
    },

    /**
     * Unsubscribe an event listener
     *
     * @param {String|RegExp|(String|RegExp)[]} identifier
     * @param {Function=} callback
     *
     * @returns {Emitter}
     */
    off: function off(identifier, callback) {
        return Emitter.off.call(this, identifier, callback);
    },

    /**
     * Retrieve all listeners for a certain event
     *
     * @param {String} name
     *
     * @returns {Listener[]}
     */
    listener: function listener(name) {
        return Emitter.listener.call(this, name);
    },
};

/**
 * Subscribe an event listener
 *
 * @param {String|RegExp|(String|RegExp)[]} identifier
 * @param {Function} callback
 * @param {Boolean=} prepend
 * @param {Number=} limit
 *
 * @returns {Emitter}
 *
 * @static
 */
Emitter.on = function on(identifier, callback, prepend, limit) {
    if (isIdentifier(identifier) && isFunction(callback)) {
        var storage = weakmap.get(this);

        if (isString(identifier)) {
            subscribeEvent.call(storage, identifier, callback, prepend, limit);
        }

        if (isRegExp(identifier)) {
            subscribeExpression.call(
                storage,
                identifier,
                callback,
                prepend,
                limit
            );
        }

        if (isArray(identifier)) {
            identifier.forEach((identifier) => {
                this.on(identifier, callback, prepend, limit);
            });
        }
    }

    return this;
};

/**
 * Subscribe a once only event listener
 *
 * @param {String|RegExp|(String|RegExp)[]} identifier
 * @param {Function} callback
 * @param {Boolean=} prepend
 *
 * @returns {Emitter}
 *
 * @static
 */
Emitter.once = function once(identifier, callback, prepend) {
    return this.on(identifier, callback, prepend, 1);
};

/**
 * Subscribe a limited event listener
 *
 * @param {String|RegExp|(String|RegExp)[]} identifier
 * @param {Number} limit
 * @param {Function} callback
 * @param {Boolean=} prepend
 *
 * @returns {Emitter}
 *
 * @static
 */
Emitter.limit = function limit(identifier, limit, callback, prepend) {
    return this.on(identifier, callback, prepend, limit);
};

/**
 * Unsubscribe an event listener
 *
 * @param {String|RegExp|(String|RegExp)[]} identifier
 * @param {Function=} callback
 *
 * @returns {Emitter}
 *
 * @static
 */
Emitter.off = function off(identifier, callback) {
    if (
        isIdentifier(identifier) &&
        (isFunction(callback) || isTypeof(callback, "undefined"))
    ) {
        var storage = weakmap.get(this);

        if (isString(identifier)) {
            unsubscribeEvent.call(storage, identifier, callback);
        }

        if (isRegExp(identifier)) {
            unsubscribeExpression.call(storage, identifier, callback);
        }

        if (isArray(identifier)) {
            identifier.forEach((identifier) => {
                this.off(identifier, callback);
            });
        }
    }

    return this;
};

/**
 * Retrieve all listeners for a certain event
 *
 * @param {String} name
 *
 * @returns {Listener[]}
 *
 * @static
 */
Emitter.listener = function listener(name) {
    return retrieveListener.call(this, name).map(mapListener);
};

export default initialize(Emitter);
