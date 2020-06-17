import { configure } from "../../rollup.config.js";
import { name, version, author, dependencies } from "./package.json";

export default [
    "src/index.js",
    "src/constant/index.js",
    "src/constant/global.js",
    "src/helper/index.js",
    "src/helper/doIdle.js",
    "src/helper/doImmediate.js",
    "src/helper/forEach.js",
    "src/helper/hash.js",
    "src/helper/merge.js",
    "src/helper/toArray.js",
    "src/helper/uuid.js",
].map((input) => configure({
    input,
    name,
    version,
    author,
    dependencies
}));
