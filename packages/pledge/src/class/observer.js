import { isArray } from "@qoopido/validator";
import { helper } from "@qoopido/utility";
import { ERROR_PLEDGES_NO_ARRAY } from "../constant";
import Deferred from "./deferred";

/**
 * Observe the state of a pledge
 *
 * @param {Pledge} pledge
 * @param {Number} index
 * @param {Observer} observer
 *
 * @ignore
 */
function observe(pledge, index, observer) {
    pledge.then(
        function () {
            observer.resolved[index] = helper.toArray(arguments);

            observer.count++;

            check(observer);
        },
        function () {
            observer.rejected.push(helper.toArray(arguments));

            check(observer);
        }
    );
}

/**
 * Check the state of an observer
 *
 * @param {Observer} observer
 *
 * @ignore
 */
function check(observer) {
    if (observer.count === observer.total) {
        observer.deferred.resolve.apply(null, [].concat(observer.resolved));
    } else if (observer.rejected.length + observer.count === observer.total) {
        observer.deferred.reject.apply(null, [].concat(observer.rejected));
    }
}

/**
 * Class Observer
 *
 * @member {Deferred} deferred
 * @member {Array.<Array.<Pledge>>} resolved
 * @member {Array.<Array.<Pledge>>} rejected
 * @member {Number} count
 * @member {Number} total
 */
export default class Observer {
    /**
     * Constructor
     *
     * @param {Pledge[]} pledges
     */
    constructor(pledges) {
        if (!isArray(pledges)) {
            throw new TypeError(ERROR_PLEDGES_NO_ARRAY);
        }

        const self = this;

        self.deferred = new Deferred();

        if (pledges.length) {
            self.resolved = [];
            self.rejected = [];
            self.total = pledges.length;
            self.count = 0;

            pledges.forEach(function (pledge, index) {
                observe(pledge, index, self);
            });
        } else {
            self.deferred.resolve();
        }
    }
}
