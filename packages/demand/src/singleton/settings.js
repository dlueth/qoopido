import Emitter from "@qoopido/emitter";
import { helper } from "@qoopido/utility";
import {
    isTypeof,
    isObject,
    isSemver,
    isPositiveInteger,
} from "@qoopido/validator";
import Pattern from "../class/pattern";
import {
    STRING_BOOLEAN,
    STRING_STRING,
    EVENT_PRE_CONFIGURE,
    EVENT_POST_CONFIGURE,
} from "../constant";

const settings = {};

function processCache(value, key) {
    this[key] = { weight: key.length, state: value };
}

function processPattern(value, key) {
    key !== "base" && (this[key] = new Pattern(key, value));
}

class Settings extends Emitter {
    update(options) {
        if (isTypeof(options.cache, STRING_BOOLEAN)) {
            settings.cache[""] = { weight: 0, state: options.cache };
        } else if (isObject(options.cache)) {
            helper.forEach(options.cache, processCache, settings.cache);
        }

        if (isSemver(options.version)) {
            settings.version = options.version;
        }

        // @TODO check if necessary, name seems misleading
        if (isPositiveInteger(options.delay)) {
            settings.delay = options.delay * 1000;
        }

        if (isPositiveInteger(options.timeout)) {
            settings.timeout =
                Math.min(Math.max(options.timeout, 2), 20) * 1000;
        }

        if (isPositiveInteger(options.lifetime) && options.lifetime > 0) {
            settings.lifetime = options.lifetime * 1000;
        }

        if (isTypeof(options.base, STRING_STRING) && options.base !== "") {
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
}

export default new Settings();
