import { isSemver } from "@qoopido/validator";

/**
 * Parse a given semver-version into its parts
 *
 * @param {String} version
 *
 * @returns {Array}
 *
 * @ignore
 */
function parse(version) {
    let parts = version.split("-");
    let i;
    let temp;

    parts = !parts[1]
        ? parts[0].split(".")
        : parts[0].split(".").concat(parts[1].split("."));

    for (i = 0; (temp = parts[i]); i++) {
        parts[i] =
            parseInt(temp, 10).toString() === temp ? parseInt(temp, 10) : temp;
    }

    return parts;
}

/**
 * Compare major/minor/patch level
 *
 * @param {Number} a
 * @param {Number} b
 *
 * @returns {Number}
 *
 * @ignore
 */
function compareLevel(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Compare identifier
 *
 * @param {Array} a
 * @param {Array} b
 *
 * @returns {Number}
 *
 * @ignore
 */
function compareIdentifier(a, b) {
    let i = 0;
    let pa;
    let pb;
    let tpa;
    let tpb;

    if (a.length && !b.length) {
        return -1;
    } else if (!a.length && b.length) {
        return 1;
    } else if (!a.length && !b.length) {
        return 0;
    }

    do {
        pa = a[i];
        pb = b[i];
        tpa = typeof pa;
        tpb = typeof pb;

        if (tpa === "undefined" && tpb === "undefined") {
            return 0;
        } else if (tpb === "undefined") {
            return 1;
        } else if (tpa === "undefined") {
            return -1;
        } else if (pa === pb) {
            // purposely skip
        } else {
            if (tpa === "string" && tpb !== "string") {
                return 1;
            } else if (tpa !== "string" && tpb === "string") {
                return -1;
            } else {
                /* istanbul ignore else */
                if (pa < pb) {
                    return -1;
                } else if (pa > pb) {
                    return 1;
                }
            }
        }
    } while (++i);
}

/**
 * Class Semver
 */
export default class Semver {
    /**
     * Constructor
     *
     * @param {String} version
     */
    constructor(version) {
        if (!isSemver(version)) {
            throw new TypeError(
                '"version" must be a valid semver version string'
            );
        }

        const parts = parse(version);

        this.major = parts.shift();
        this.minor = parts.shift();
        this.patch = parts.shift();
        this.identifier = parts;
    }

    /**
     * Return a string representation of a semver-version
     *
     * @returns {String}
     */
    toString() {
        return (
            this.major +
            "." +
            this.minor +
            "." +
            this.patch +
            (this.identifier.length ? "-" + this.identifier.join(".") : "")
        );
    }

    /**
     * Compare versions
     *
     * @param {Semver} version
     *
     * @returns {Number}
     */
    compare(version) {
        if (!(version instanceof Semver)) {
            throw new TypeError('"version" must be an instance of Semver');
        }

        return (
            compareLevel(this.major, version.major) ||
            compareLevel(this.minor, version.minor) ||
            compareLevel(this.patch, version.patch) ||
            compareIdentifier(this.identifier, version.identifier)
        );
    }

    /**
     * Check if a semver-version is greater than a given version
     *
     * @param {Semver} version
     *
     * @returns {boolean}
     */
    isGreaterThan(version) {
        return this.compare(version) > 0;
    }

    /**
     * Check if a semver-version is smaller than a given version
     *
     * @param {Semver} version
     *
     * @returns {boolean}
     */
    isSmallerThan(version) {
        return this.compare(version) < 0;
    }

    /**
     * Check if a semver-version is equal to a given version
     *
     * @param {Semver} version
     *
     * @returns {boolean}
     */
    isEqualTo(version) {
        return this.compare(version) === 0;
    }
}
