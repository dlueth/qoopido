import { helper } from "@qoopido/utility";
import matchInternal from "./regex/matchInternal";
import registry from "./registry";

/**
 * Add non-internal dependency IDs to an array
 *
 * @param {Dependency} dependency
 * @param {String} id
 *
 * @this Array.<String>
 *
 * @ignore
 */
function add(dependency, id) {
    if (!matchInternal.test(id)) {
        this.push(id);
    }
}

/**
 * Add IDs of pending dependencies to an array
 *
 * @param {Dependency} dependency
 * @param {String} id
 *
 * @this Array.<String>
 *
 * @ignore
 */
function addPending(dependency, id) {
    if (!matchInternal.test(id) && dependency.isPending) {
        this.push(id);
    }
}

/**
 * Add IDs of resolved dependencies to an array
 *
 * @param {Dependency} dependency
 * @param {String} id
 *
 * @this Array.<String>
 *
 * @ignore
 */
function addResolved(dependency, id) {
    if (!matchInternal.test(id) && dependency.isResolved) {
        this.push(id);
    }
}

/**
 * Add IDs of rejected dependencies to an array
 *
 * @param {Dependency} dependency
 * @param {String} id
 *
 * @this Array.<String>
 *
 * @ignore
 */
function addRejected(dependency, id) {
    if (!matchInternal.test(id) && dependency.isRejected) {
        this.push(id);
    }
}

/**
 * Return a list of all known modules
 *
 * @returns {Array}
 */
function list() {
    return helper.forEach(registry.get(), add, []);
}

/**
 * Return a list of all pending modules
 *
 * @returns {Array}
 */
list.pending = function () {
    return helper.forEach(registry.get(), addPending, []);
};

/**
 * Return a list of all resolved modules
 *
 * @returns {Array}
 */
list.resolved = function () {
    return helper.forEach(registry.get(), addResolved, []);
};

/**
 * Return a list of all rejected modules
 *
 * @returns {Array}
 */
list.rejected = function () {
    return helper.forEach(registry.get(), addRejected, []);
};

export default list;
