import { helper } from "@qoopido/utility";
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

const weakmap = new WeakMap();

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
 * @param {Number} a.timestamp
 * @param {Object} b
 * @param {Number} b.timestamp
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
    const self = this;

    listener.reduce(function (previous, next) {
        if (!event.isCanceled) {
            if (next.remaining && !(next.remaining -= 1)) {
                self.off(next.identifier, next.callback);
            }

            if (isThenable(previous)) {
                return previous.then(function () {
                    return next.callback.apply(self, [event].concat(details));
                });
            }

            return next.callback.apply(self, [event].concat(details));
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
    let listener;

    if (isString(name)) {
        const storage = weakmap.get(this);

        listener = storage.events[name] ? storage.events[name].slice() : [];

        if (this !== Emitter) {
            listener = listener.concat(retrieveListener.call(Emitter, name));
        }

        storage.expressions.forEach(function (expression) {
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
class Emitter {
    /**
     * Constructor
     */
    constructor() {
        initialize(this);
    }

    /**
     * Emit an event
     *
     * @param {String} name
     * @param {...*} details
     *
     * @returns {Emitter}
     */
    emit(name) {
        const listener = retrieveListener.call(this, name);

        if (listener.length) {
            applyEvent.call(
                this,
                listener,
                new Event(name, this),
                helper.toArray(arguments, 1)
            );
        }

        return this;
    }

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
    on(identifier, callback, prepend, limit) {
        return Emitter.on.call(this, identifier, callback, prepend, limit);
    }

    /**
     * Subscribe a once only event listener
     *
     * @param {String|RegExp|(String|RegExp)[]} identifier
     * @param {Function} callback
     * @param {Boolean=} prepend
     *
     * @returns {Emitter}
     */
    once(identifier, callback, prepend) {
        return Emitter.once.call(this, identifier, callback, prepend);
    }

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
    limit(identifier, limit, callback, prepend) {
        return Emitter.limit.call(this, identifier, limit, callback, prepend);
    }

    /**
     * Unsubscribe an event listener
     *
     * @param {String|RegExp|(String|RegExp)[]} identifier
     * @param {Function=} callback
     *
     * @returns {Emitter}
     */
    off(identifier, callback) {
        return Emitter.off.call(this, identifier, callback);
    }

    /**
     * Retrieve all listeners for a certain event
     *
     * @param {String} name
     *
     * @returns {Function[]}
     */
    listener(name) {
        return Emitter.listener.call(this, name);
    }

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
    static on(identifier, callback, prepend, limit) {
        const self = this;

        if (isIdentifier(identifier) && isFunction(callback)) {
            const storage = weakmap.get(self);

            if (isString(identifier)) {
                subscribeEvent.call(
                    storage,
                    identifier,
                    callback,
                    prepend,
                    limit
                );
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
                identifier.forEach(function (identifier) {
                    self.on(identifier, callback, prepend, limit);
                });
            }
        }

        return self;
    }

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
    static once(identifier, callback, prepend) {
        return this.on(identifier, callback, prepend, 1);
    }

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
    static limit(identifier, limit, callback, prepend) {
        return this.on(identifier, callback, prepend, limit);
    }

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
    static off(identifier, callback) {
        const self = this;

        if (
            isIdentifier(identifier) &&
            (isFunction(callback) || isTypeof(callback, "undefined"))
        ) {
            const storage = weakmap.get(self);

            if (isString(identifier)) {
                unsubscribeEvent.call(storage, identifier, callback);
            }

            if (isRegExp(identifier)) {
                unsubscribeExpression.call(storage, identifier, callback);
            }

            if (isArray(identifier)) {
                identifier.forEach(function (identifier) {
                    self.off(identifier, callback);
                });
            }
        }

        return self;
    }

    /**
     * Retrieve all listeners for a certain event
     *
     * @param {String} name
     *
     * @returns {Function[]}
     *
     * @static
     */
    static listener(name) {
        return retrieveListener.call(this, name).map(mapListener);
    }
}

export default initialize(Emitter);
