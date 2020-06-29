import { isFalsy, isString } from "@qoopido/validator";

const storage = new WeakMap();

/**
 * Class Registry
 */
class Registry {
    /**
     * Constructor
     */
    constructor() {
        storage.set(this, {});
    }

    /**
     * Get given key or full registry
     *
     * @param {String} [key]
     *
     * @returns {*}
     */
    get(key) {
        return isString(key) && !isFalsy(key)
            ? storage.get(this)[key]
            : storage.get(this);
    }

    /**
     * Set value for a given key
     *
     * @param {String} key
     * @param {*} value
     *
     * @returns {Registry}
     */
    set(key, value) {
        if (isString(key) && !isFalsy(key)) {
            storage.get(this)[key] = value;
        }

        return this;
    }

    /**
     * Remove a given key
     *
     * @param {String} key
     *
     * @returns {Registry}
     */
    remove(key) {
        if (isString(key) && !isFalsy(key)) {
            delete storage.get(this)[key];
        }

        return this;
    }
}

export default new Registry();
