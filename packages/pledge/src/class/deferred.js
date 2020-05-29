import Pledge from "../index";

/**
 * Class Deferred
 *
 * @member {Pledge} pledge
 * @member {Function} resolve
 * @member {Function} reject
 */
export default class Deferred {
    /**
     * Constructor
     */
    constructor() {
        const self = this;

        self.pledge = new Pledge(function (onFulfill, onReject) {
            self.resolve = onFulfill;
            self.reject = onReject;
        });
    }
}
