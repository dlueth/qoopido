import global from "@qoopido/global";
import Emitter from "@qoopido/emitter";
import Pledge from "@qoopido/pledge";
import { helper } from "@qoopido/utility";
import { isString } from "@qoopido/validator";
import { EVENT_PRE_RESOLVE, EVENT_POST_RESOLVE } from "./constant";
import resolveDependency from "./resolve/dependency";
const emitter = new Emitter();

/**
 * Request any number of dependencies
 *
 * @param {...*} dependencies
 *
 * @returns {Pledge}
 */
export default function demand(dependencies) {
    dependencies = helper.toArray(arguments);

    const context = this !== global ? this : null;

    emitter.emit(EVENT_PRE_RESOLVE, dependencies, context);

    helper.forEach(dependencies, function (value, index) {
        if (isString(value)) {
            dependencies[index] = resolveDependency(value, context);
        } else {
            dependencies[index] = Pledge.resolve(value);
        }
    });

    return (dependencies.length > 1
        ? Pledge.all(dependencies)
        : dependencies[0]
    ).always(function () {
        emitter.emit(EVENT_POST_RESOLVE, dependencies, context);
    });
}
