import Emitter from "@qoopido/emitter";
import { helper } from "@qoopido/utility";
import { isObject } from "@qoopido/validator";
import Dependency from "../Dependency";
import registry from "../registry";
import Handler from "../handler";
import provide from "../provide";
import { ID_DEMAND, EVENT_POST_CONFIGURE, PATH_HANDLER } from "../constant";

const path = PATH_HANDLER + "module";
const id = "module!" + path;
const target = document.getElementsByTagName("head")[0];
const settings = {
    mimetype: /^(application|text)\/(x-)?javascript/,
};

Emitter.on(EVENT_POST_CONFIGURE + ":" + path, function (options) {
    if (isObject(options)) {
        helper.merge(settings, options);
    }
});

/**
 * HandlerModule
 */
class HandlerModule extends Handler {
    /**
     * Validate mimetype
     *
     * @param {String} type
     *
     * @returns {Boolean}
     */
    validate(type) {
        return settings.mimetype.test(type);
    }

    /**
     * Process module injection/resolution
     *
     * @param {Dependency} dependency
     */
    process(dependency) {
        if (dependency.source) {
            const script = document.createElement("script");
            const define = global.define;

            script.async = true;
            script.text = dependency.source;

            script.setAttribute(ID_DEMAND + "-id", dependency.id);

            global.define = provide;

            target.appendChild(script);

            global.define = define;
        }
    }
}

const instance = new HandlerModule();
new Dependency(id, null, true).resolve(instance);
export default instance;
