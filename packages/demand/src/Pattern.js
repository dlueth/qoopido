import { helper } from "@qoopido/utility";
import { isPositiveInteger } from "@qoopido/validator";
import matchTrailingSlash from "./regex/matchTrailingSlash";
import resolveUrl from "./resolve/url";

/**
 * Process a string location into a corresponding object
 *
 * @param {String} value
 * @param {String} key
 *
 * @this Array.<String|Object>
 *
 * @ignore
 */
function processLocation(value, key) {
    this[key] = resolveUrl(value).replace(matchTrailingSlash, "$1");
}

/**
 * Class Pattern
 */
export default class Pattern {
    /**
     * Constructor
     *
     * @param {String} pattern
     * @param {String|Array.<String>} url
     */
    constructor(pattern, url) {
        this.weight = pattern.length;
        this.match = new RegExp("^" + pattern);
        this.location = [].concat(url);

        helper.forEach(this.location, processLocation, this.location);
    }

    /**
     * Check if a Pattern matches a given path
     *
     * @param {String} path
     *
     * @returns {Boolean}
     */
    matches(path) {
        return this.match.test(path);
    }

    /**
     * Process the Pattern for a given path and index
     *
     * @param {String} path
     * @param {Number} index
     *
     * @returns {void|String}
     */
    process(path, index) {
        if (
            this.matches(path) &&
            isPositiveInteger(index) &&
            this.location[index]
        ) {
            return path.replace(this.match, this.location[index]);
        }
    }
}
