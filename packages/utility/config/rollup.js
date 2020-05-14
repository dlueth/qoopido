import { configure } from "../../../config/rollup";
import { name, version, author, dependencies } from "../package.json";

export default [
    "src/index.js",
    "src/constant/index.js",
    "src/constant/global.js",
    "src/helper/index.js",
    "src/helper/doImmediate.js",
    "src/helper/toArray.js",
    "src/helper/uuid.js",
].map((input) => configure({
    input,
    name,
    version,
    author,
    dependencies
}));
