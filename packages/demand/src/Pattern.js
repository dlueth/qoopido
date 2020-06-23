import { helper } from "@qoopido/utility";
import resolveUrl from "./resolve/url";

const matchTrailingSlash = /(.+)\/$/;

function processLocation(value, key) {
    this[key] = {
        url: resolveUrl(value).replace(matchTrailingSlash, "$1"),
        match: new RegExp("^" + value),
    };
}

export default class Pattern {
    constructor(pattern, url) {
        this.weight = pattern.length;
        this.match = new RegExp("^" + pattern);
        this.location = [].concat(url);

        helper.forEach(this.location, processLocation, this.location);
    }

    matches(path) {
        return this.match.test(path);
    }

    process(path, index) {
        if (this.location[index]) {
            return path.replace(this.match, this.location[index].url);
        }
    }
}
