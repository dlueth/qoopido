import { configure } from "../../rollup.config.js";
import { name, version, author, dependencies } from "./package.json";

export default [
    "src/index.js",
    "src/isArray.js",
    "src/isFalsy.js",
    "src/isFunction.js",
    "src/isInstanceof.js",
    "src/isObject.js",
    "src/isRegExp.js",
    "src/isSemver.js",
    "src/isString.js",
    "src/isThenable.js",
    "src/isTypeof.js",
].map((input) => configure({
    input,
    name,
    version,
    author,
    dependencies
}));
