import Emitter from "@qoopido/emitter";
import { helper } from "@qoopido/utility";
import {
    isTypeof,
    isObject,
    isSemver,
    isString,
    isPositiveInteger,
} from "@qoopido/validator";
import Pattern from "./Pattern";
import {
    STRING_BOOLEAN,
    EVENT_PRE_CONFIGURE,
    EVENT_POST_CONFIGURE,
} from "./constant";

const settings = {
    version: "1.0.0",
    cache: {},
    timeout: 8000,
    pattern: {},
    modules: {},
};

/**
 * Process a cache string into a corresponding object
 *
 * @param {String} value
 * @param {String} key
 *
 * @this Object.<String|Object>
 *
 * @ignore
 */
function processCache(value, key) {
    this[key] = { weight: key.length, state: value };
}

/**
 * Process a pattern string into an instance of Pattern
 *
 * @param {String} value
 * @param {String} key
 *
 * @this Object.<String|Object>
 *
 * @ignore
 */
function processPattern(value, key) {
    key !== "base" && (this[key] = new Pattern(key, value));
}

/**
 * Class Settings
 */
class Settings extends Emitter {
    /**
     * Update settings
     *
     * @param {Object} options
     */
    update(options) {
        if (isTypeof(options.cache, STRING_BOOLEAN)) {
            settings.cache[""] = { weight: 0, state: options.cache };
        } else if (isObject(options.cache)) {
            helper.forEach(options.cache, processCache, settings.cache);
        }

        if (isSemver(options.version)) {
            settings.version = options.version;
        }

        if (isPositiveInteger(options.timeout)) {
            settings.timeout =
                Math.min(Math.max(options.timeout, 2), 20) * 1000;
        }

        if (isPositiveInteger(options.lifetime) && options.lifetime > 0) {
            settings.lifetime = options.lifetime * 1000;
        }

        if (isString(options.base) && options.base !== "") {
            settings.pattern.base = new Pattern("", options.base);
        }

        if (isObject(options.pattern)) {
            helper.forEach(options.pattern, processPattern, settings.pattern);
        }

        if (isObject(options.modules)) {
            helper.forEach(
                options.modules,
                function (value, key) {
                    const pointer = (settings.modules[key] =
                        settings.modules[key] || {});

                    this.emit(EVENT_PRE_CONFIGURE, key, pointer);

                    helper.merge(pointer, value);

                    this.emit(EVENT_POST_CONFIGURE, key, pointer);
                },
                this
            );
        }
    }

    /**
     * Retrieve version
     *
     * @returns {String}
     */
    get version() {
        return settings.version;
    }
}

export default new Settings();
