import Pledge from "@qoopido/pledge";
import Semver from "@qoopido/semver";
import { helper } from "@qoopido/utility";
import { isPositiveInteger } from "@qoopido/validator";
import matchInternal from "./regex/matchInternal";
import matchHandler from "./regex/matchHandler";
import matchParameter from "./regex/matchParameter";
import { DEFAULT_HANDLER, PATH_HANDLER, PREFIX_MOCK } from "./constant";
import demand from "./demand";
import registry from "./registry";
import settings from "./settings";
import resolvePath from "./resolve/path";

const weakmap = new WeakMap();
const placeholder = [];

/**
 * Class Dependency
 */
export default class Dependency {
    /**
     * Constructor
     *
     * @param {String} uri
     * @param {String} [context]
     * @param {Boolean} [register=true]
     */
    constructor(uri, context, register) {
        const parameter = uri.match(matchParameter) || placeholder;
        const isInternal = context && matchInternal.test(uri);
        const isMock = !!parameter[1];
        const cache = parameter[2] ? parameter[1] === "+" : null;
        const type = parameter[3] || DEFAULT_HANDLER;
        const version = new Semver(parameter[4] || settings.version);
        const lifetime =
            (parameter[5] && parameter[5] * 1000) || settings.lifetime;
        const path = resolvePath(uri, context);
        const id = (isMock ? PREFIX_MOCK : "") + type + "!" + path;
        const dfd = Pledge.defer();
        const pledge = dfd.pledge;
        let storage;

        weakmap.set(this, {
            isInternal: isInternal,
            isMock: isMock,
            isExpired: false,
            handler: null,
            value: null,
            source: null, // set by Cache or Loader @TODO check if listening to an event is possible instead of having it from somewhere external
            url: null, // optional, set by Loader @TODO check if listening to an event is possible instead of having it from somewhere external
            cache: cache,
            type: type,
            version: version,
            lifetime: lifetime,
            path: path,
            id: id,
            uri:
                (isMock ? PREFIX_MOCK : "") +
                type +
                "@" +
                version +
                (isPositiveInteger(lifetime) && lifetime > 0
                    ? "#" + lifetime
                    : "") +
                "!" +
                path,
            dfd: dfd,
            pledge: pledge,
        });

        storage = weakmap.get(this);

        pledge.then(function () {
            storage.value = helper.toArray(arguments);
        });

        if (!isInternal && !matchHandler.test(path)) {
            demand(PATH_HANDLER + type)
                .then(
                    function (handler) {
                        storage.handler = handler;

                        if (isMock) {
                            this.resolve(handler);
                        }
                    }.bind(this)
                )
                .catch(this.reject);
        }

        register !== false && registry.set(id, this);
    }

    /**
     * Retrieve whether it is internal
     *
     * @returns {Boolean}
     */
    get isInternal() {
        return weakmap.get(this).isInternal;
    }

    /**
     * Retrieve whether it is a mock
     *
     * @returns {Boolean}
     */
    get isMock() {
        return weakmap.get(this).isMock;
    }

    /**
     * Retrieve whether the cache is expired
     *
     * @returns {Boolean}
     */
    get isExpired() {
        return weakmap.get(this).isExpired;
    }

    /**
     * Retrieve the handler
     *
     * @returns {Handler}
     */
    get handler() {
        return weakmap.get(this).handler;
    }

    /**
     * Retrieve the actual module
     *
     * @returns {*}
     */
    get value() {
        return weakmap.get(this).value;
    }

    /**
     * Retrieve the actual source
     *
     * @returns {String}
     */
    get source() {
        return weakmap.get(this).source;
    }

    /**
     * Retrieve the actual URL
     *
     * @returns {String}
     */
    get url() {
        return weakmap.get(this).url;
    }

    /**
     * Retrieve whether to cache
     *
     * @returns {Boolean}
     */
    get cache() {
        return weakmap.get(this).cache;
    }

    /**
     * Retrieve the type
     *
     * @returns {String}
     */
    get type() {
        return weakmap.get(this).type;
    }

    /**
     * Retrieve the version
     *
     * @returns {Semver}
     */
    get version() {
        return weakmap.get(this).version;
    }

    /**
     * Retrieve the cache lifetime
     *
     * @returns {Number}
     */
    get lifetime() {
        return weakmap.get(this).lifetime;
    }

    /**
     * Retrieve the path
     *
     * @returns {String}
     */
    get path() {
        return weakmap.get(this).path;
    }

    /**
     * Retrieve the ID
     *
     * @returns {String}
     */
    get id() {
        return weakmap.get(this).id;
    }

    /**
     * Retrieve the URI
     *
     * @returns {String}
     */
    get uri() {
        return weakmap.get(this).uri;
    }

    /**
     * Retrieve whether the state is settled
     *
     * @returns {Boolean}
     */
    get isSettled() {
        return weakmap.get(this).pledge.isSettled;
    }

    /**
     * Retrieve whether the state is pending
     *
     * @returns {Boolean}
     */
    get isPending() {
        return weakmap.get(this).pledge.isPending;
    }

    /**
     * Retrieve whether the state is resolved
     *
     * @returns {Boolean}
     */
    get isResolved() {
        return weakmap.get(this).pledge.isResolved;
    }

    /**
     * Retrieve whether the state is rejected
     *
     * @returns {Boolean}
     */
    get isRejected() {
        return weakmap.get(this).pledge.isRejected;
    }

    /**
     * Passthrough `then` to the actual pledge
     *
     * @returns {Pledge}
     */
    then() {
        const pledge = weakmap.get(this).pledge;

        return pledge.then.apply(pledge, arguments);
    }

    /**
     * Passthrough `always` to the actual pledge
     *
     * @returns {Pledge}
     */
    always() {
        const pledge = weakmap.get(this).pledge;

        return pledge.always.apply(pledge, arguments);
    }

    /**
     * Passthrough `finally` to the actual pledge
     *
     * @returns {Pledge}
     */
    finally() {
        const pledge = weakmap.get(this).pledge;

        return pledge.finally.apply(pledge, arguments);
    }

    /**
     * Passthrough `catch` to the actual pledge
     *
     * @returns {Pledge}
     */
    catch() {
        const pledge = weakmap.get(this).pledge;

        return pledge.catch.apply(pledge, arguments);
    }

    /**
     * Passthrough `resolve` to the actual deferred
     *
     * @returns {Function}
     */
    resolve() {
        const dfd = weakmap.get(this).dfd;

        return dfd.resolve.apply(dfd, arguments);
    }

    /**
     * Passthrough `reject` to the actual deferred
     *
     * @returns {Function}
     */
    reject() {
        const dfd = weakmap.get(this).dfd;

        return dfd.reject.apply(dfd, arguments);
    }
}
