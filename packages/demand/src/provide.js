import global from "@qoopido/global";
import { isString, isArray, isThenable, isFunction } from "@qoopido/validator";
import Dependency from "./Dependency";
import demand from "./demand";
import { ProvideError, AnonymousError } from "./error";
import processor from "./processor";

/**
 * Provide a module
 *
 * @param {String} [uri]
 * @param {Array.<String>} [dependencies]
 * @param {*} factory
 *
 * @returns {Pledge}
 */
export default function provide(uri, dependencies, factory) {
    uri = isString(arguments[0]) ? arguments[0] : null;
    dependencies = isArray(arguments[uri ? 1 : 0])
        ? arguments[uri ? 1 : 0]
        : null;
    factory = dependencies ? arguments[uri ? 2 : 1] : arguments[uri ? 1 : 0];

    const context = this !== global ? this : null;
    let dependency = processor.current;

    if (dependency) {
        uri = dependency.uri;

        processor.process();
    }

    if (uri) {
        dependency = dependency || new Dependency(uri, context);

        if (dependencies && dependencies.length) {
            demand.apply(dependency.path, dependencies).then(
                function () {
                    dependency.resolve(
                        isFunction(factory)
                            ? factory.apply(null, arguments)
                            : factory
                    );
                },
                function () {
                    dependency.reject(new ProvideError(dependency.id));
                }
            );
        } else {
            if (isThenable(factory)) {
                factory.then(dependency.resolve, dependency.reject);
            } else {
                dependency.resolve(isFunction(factory) ? factory() : factory);
            }
        }
    }

    throw new AnonymousError();
}

provide.amd = true;
