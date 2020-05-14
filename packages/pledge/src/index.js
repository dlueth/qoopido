import { helper } from "@qoopido/utility";
import {
    isInstanceof,
    isTypeof,
    isFunction,
    isArray,
} from "@qoopido/validator";
import {
    ERROR_EXECUTOR_NO_FUNCTION,
    ERROR_PLEDGES_NO_ARRAY,
    MSG_UNHANDLED_REJECTION,
    STATE_PENDING,
    STATE_RESOLVED,
    STATE_REJECTED,
} from "./constant";

var weakmap = new WeakMap();

function resolve() {
    var properties = weakmap.get(this),
        args = arguments;

    properties.state = STATE_RESOLVED;

    helper.doImmediate(function () {
        properties.handle(args);
    });
}

function reject() {
    var properties = weakmap.get(this),
        args = arguments;

    properties.state = STATE_REJECTED;

    helper.doImmediate(function () {
        properties.handle(args);
    });
}

function handleUncaught(values) {
    console.error.apply(
        null,
        [MSG_UNHANDLED_REJECTION].concat(helper.toArray(values))
    );
}

function handle(parameter) {
    var properties = weakmap.get(this),
        state = properties.state,
        pointer,
        result;

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

            if (isInstanceof(result, Pledge)) {
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

function observe(pledge, index, properties) {
    pledge.then(
        function () {
            properties.resolved[index] = helper.toArray(arguments);

            properties.count++;

            check(properties);
        },
        function () {
            properties.rejected.push(helper.toArray(arguments));

            check(properties);
        }
    );
}

function check(properties) {
    if (properties.count === properties.total) {
        properties.dfd.resolve.apply(null, [].concat(properties.resolved));
    } else if (
        properties.rejected.length + properties.count ===
        properties.total
    ) {
        properties.dfd.reject.apply(null, [].concat(properties.rejected));
    }
}

function Pledge(executor) {
    var self = this;

    if (!isFunction(executor)) {
        throw new TypeError(ERROR_EXECUTOR_NO_FUNCTION);
    }

    weakmap.set(self, {
        state: STATE_PENDING,
        settled: false,
        handle: handle.bind(self),
        value: null,
        resolved: [],
        rejected: [],
        count: 0,
    });

    try {
        executor(resolve.bind(self), reject.bind(self));
    } catch (error) {
        reject.call(self, error);
    }

    return self;
}

Pledge.prototype = {
    isSettled: function () {
        return weakmap.get(this).state !== STATE_PENDING;
    },
    isPending: function () {
        return weakmap.get(this).state === STATE_PENDING;
    },
    isResolved: function () {
        return weakmap.get(this).state === STATE_RESOLVED;
    },
    isRejected: function () {
        return weakmap.get(this).state === STATE_REJECTED;
    },
    then: function (onFulfill, onReject) {
        var properties = weakmap.get(this),
            dfd = Pledge.defer();

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
    },
    always: function (listener) {
        return this.then(listener, listener);
    },
    finally: function (listener) {
        return this.then(listener, listener);
    },
    catch: function (listener) {
        return this.then(undefined, listener);
    },
};

Pledge.defer = function () {
    var self = {};

    self.pledge = new Pledge(function (onFulfill, onReject) {
        self.resolve = onFulfill;
        self.reject = onReject;
    });

    return self;
};

Pledge.all = function (pledges) {
    var dfd = Pledge.defer(),
        properties,
        i = 0,
        pledge;

    if (!isArray(pledges)) {
        throw new TypeError(ERROR_PLEDGES_NO_ARRAY);
    }

    if (pledges.length) {
        properties = {
            dfd: dfd,
            resolved: [],
            rejected: [],
            total: pledges.length,
            count: 0,
        };

        for (; (pledge = pledges[i]); i++) {
            observe(pledge, i, properties);
        }
    } else {
        dfd.resolve();
    }

    return dfd.pledge;
};

Pledge.race = function (pledges) {
    var dfd = Pledge.defer(),
        i = 0,
        pledge;

    if (!isArray(pledges)) {
        throw new TypeError(ERROR_PLEDGES_NO_ARRAY);
    }

    for (; (pledge = pledges[i]); i++) {
        pledge.then(dfd.resolve, dfd.reject);
    }

    if (!pledges.length) {
        dfd.resolve();
    }

    return dfd.pledge;
};

Pledge.resolve = function () {
    var args = arguments;

    return new Pledge(function (resolve) {
        resolve.apply(null, args);
    });
};

Pledge.reject = function () {
    var args = arguments;

    return new Pledge(function (resolve, reject) {
        reject.apply(null, args);
    });
};

export default Pledge;
