import { isThenable, isTypeof, isFunction, isArray } from "@qoopido/validator";
import { helper } from "@qoopido/utility";
import {
    ERROR_EXECUTOR_NO_FUNCTION,
    ERROR_PLEDGES_NO_ARRAY,
    MSG_UNHANDLED_REJECTION,
    STATE_PENDING,
    STATE_RESOLVED,
    STATE_REJECTED,
} from "./constant";
import Deferred from "./class/deferred";
import Observer from "./class/observer";

const weakmap = new WeakMap();

/**
 * Resolve a pledge
 *
 * @ignore
 */
function resolve() {
    const properties = weakmap.get(this);
    const args = arguments;

    properties.state = STATE_RESOLVED;

    helper.doImmediate(function () {
        properties.handle(args);
    });
}

/**
 * Reject a pledge
 *
 * @ignore
 */
function reject() {
    const properties = weakmap.get(this);
    const args = arguments;

    properties.state = STATE_REJECTED;

    helper.doImmediate(function () {
        properties.handle(args);
    });
}

/**
 * Handle uncaught Pledge-rejections
 *
 * @param {Error[]} errors
 *
 * @ignore
 */
function handleUncaught(errors) {
    console.error.apply(
        null,
        [MSG_UNHANDLED_REJECTION].concat(helper.toArray(errors))
    );
}

/**
 * Handle Pledge fulfilment
 *
 * @param {*[]} parameter
 *
 * @ignore
 */
function handle(parameter) {
    const properties = weakmap.get(this);
    const state = properties.state;

    let pointer;
    let result;

    if (!properties.settled) {
        properties.settled = true;
        properties.value = parameter;

        if (state === STATE_REJECTED && !properties[state].length) {
            handleUncaught(parameter);
        }
    }

    while ((pointer = properties[state].shift())) {
        try {
            result = pointer.handler.apply(null, properties.value);

            if (isThenable(result)) {
                result.then(pointer.dfd.resolve, pointer.dfd.reject);

                continue;
            }

            if (state === STATE_RESOLVED && isTypeof(result, "undefined")) {
                pointer.dfd.resolve.apply(null, properties.value);

                continue;
            }

            pointer.dfd.resolve(result);
        } catch (error) {
            pointer.dfd.reject(error);
        }
    }

    properties[STATE_RESOLVED].length = 0;
    properties[STATE_REJECTED].length = 0;
}

/**
 * Class Pledge
 */
export default class Pledge {
    /**
     * Constructor
     *
     * @param {Function} executor
     */
    constructor(executor) {
        if (!isFunction(executor)) {
            throw new TypeError(ERROR_EXECUTOR_NO_FUNCTION);
        }

        weakmap.set(this, {
            state: STATE_PENDING,
            settled: false,
            handle: handle.bind(this),
            value: null,
            resolved: [],
            rejected: [],
            count: 0,
        });

        try {
            executor(resolve.bind(this), reject.bind(this));
        } catch (error) {
            reject.call(this, error);
        }

        return this;
    }

    /**
     * Check whether the Pledge is settled
     *
     * @returns {Boolean}
     */
    get isSettled() {
        return weakmap.get(this).state !== STATE_PENDING;
    }

    /**
     * Check whether the Pledge is pending
     *
     * @returns {Boolean}
     */
    get isPending() {
        return weakmap.get(this).state === STATE_PENDING;
    }

    /**
     * Check whether the Pledge is resolved
     *
     * @returns {Boolean}
     */
    get isResolved() {
        return weakmap.get(this).state === STATE_RESOLVED;
    }

    /**
     * Check whether the Pledge is rejected
     *
     * @returns {Boolean}
     */
    get isRejected() {
        return weakmap.get(this).state === STATE_REJECTED;
    }

    /**
     * Attach separate onFulfill/onReject listener
     *
     * @param {Function} [onFulfill]
     * @param {Function} [onReject]
     *
     * @returns {Pledge}
     */
    then(onFulfill, onReject) {
        const properties = weakmap.get(this);
        const dfd = Pledge.defer();

        properties[STATE_RESOLVED].push({
            handler: onFulfill || Pledge.resolve,
            dfd: dfd,
        });

        properties[STATE_REJECTED].push({
            handler: onReject || Pledge.reject,
            dfd: dfd,
        });

        if (properties.settled && properties.state !== STATE_PENDING) {
            helper.doImmediate(properties.handle);
        }

        return dfd.pledge;
    }

    /**
     * Attach a listener regardless of the outcome (alias of `finally`)
     *
     * @param {Function} listener
     *
     * @returns {Pledge}
     */
    always(listener) {
        return this.finally(listener);
    }

    /**
     * Attach a listener regardless of the outcome
     *
     * @param {Function} listener
     *
     * @returns {Pledge}
     */
    finally(listener) {
        return this.then(listener, listener);
    }

    /**
     * Attach a listener to any rejection
     *
     * @param {Function} listener
     *
     * @returns {Pledge}
     */
    catch(listener) {
        return this.then(undefined, listener);
    }

    /**
     * Create a deferred pledge
     *
     * @returns {Deferred}
     * @static
     */
    static defer() {
        return new Deferred();
    }

    /**
     * Return a pledge that gets resolved when all given
     * pledges did resolve or any pledge did reject
     *
     * @param {Pledge[]} pledges
     *
     * @returns {Pledge}
     * @static
     */
    static all(pledges) {
        return new Observer(pledges).deferred.pledge;
    }

    /**
     * Return a pledge that gets resolved or rejected when
     * any pledge did resolve or reject
     *
     * @param {Pledge[]} pledges
     *
     * @returns {Pledge}
     * @static
     */
    static race(pledges) {
        if (!isArray(pledges)) {
            throw new TypeError(ERROR_PLEDGES_NO_ARRAY);
        }

        const dfd = new Deferred();

        if (pledges.length) {
            pledges.forEach(function (pledge) {
                pledge.then(dfd.resolve, dfd.reject);
            });
        } else {
            dfd.resolve();
        }

        return dfd.pledge;
    }

    /**
     * Return a resolved Pledge
     *
     * @returns {Pledge}
     * @static
     */
    static resolve() {
        const args = arguments;

        return new Pledge(function (resolve) {
            resolve.apply(null, args);
        });
    }

    /**
     * Return a rejected Pledge
     *
     * @returns {Pledge}
     * @static
     */
    static reject() {
        const args = arguments;

        return new Pledge(function (resolve, reject) {
            reject.apply(null, args);
        });
    }

    /**
     * Constant for state `pending`
     *
     * @returns {String}
     * @static
     */
    static get STATE_PENDING() {
        return STATE_PENDING;
    }

    /**
     * Constant for state `resolved`
     *
     * @returns {String}
     * @static
     */
    static get STATE_RESOLVED() {
        return STATE_RESOLVED;
    }

    /**
     * Constant for state `rejected`
     *
     * @returns {String}
     * @static
     */
    static get STATE_REJECTED() {
        return STATE_REJECTED;
    }
}
