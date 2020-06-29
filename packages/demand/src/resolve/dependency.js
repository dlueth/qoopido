import { helper } from "@qoopido/utility";
import {
    ID_DEMAND,
    ID_EXPORTS,
    ID_PATH,
    ID_PROVIDE,
    PREFIX_INTERNAL,
} from "../constant";
import Dependency from "../Dependency";
import demand from "../demand";
import provide from "../provide";
import registry from "../registry";
import matchInternal from "../regex/matchInternal";
import resolveId from "./id";

/**
 * Set a key on an object
 *
 * @param {String} property
 * @param {*} value
 *
 * @this {Array|Object}.<*>
 *
 * @ignore
 */
function setKey(key, value) {
    this[key] = value;
}

/**
 * Get a dependency for a given uri and context
 *
 * @param {String} uri
 * @param {String} [context]
 *
 * @returns {Dependency|void}
 *
 * @ignore
 */
function get(uri, context) {
    return registry.get(resolveId(uri, context));
}

/**
 * Resolve a dependency for a given uri and context
 *
 * @param {String} uri
 * @param {String} [context]
 *
 * @returns {Dependency}
 */
export default function resolveDependency(uri, context) {
    const isInternal = context && matchInternal.test(uri);
    let dependency = isInternal
        ? get(PREFIX_INTERNAL + context + "/" + uri)
        : get(uri, context);
    let value;

    if (!dependency) {
        if (isInternal) {
            dependency = new Dependency(PREFIX_INTERNAL + context + "/" + uri);

            switch (uri) {
                case ID_DEMAND:
                    value = (function () {
                        return helper.forEach(
                            demand,
                            setKey,
                            demand.bind(context)
                        );
                    })();

                    break;
                case ID_PROVIDE:
                    value = provide.bind(context);

                    break;
                case ID_PATH:
                    value = context;

                    break;
                case ID_EXPORTS:
                    value = {};

                    dependency.then(get(context).dfd.resolve);

                    break;
            }

            dependency.resolve(value);
        } else {
            dependency = new Dependency(uri, context);
        }
    }

    return dependency;
}
