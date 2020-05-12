import configure from "../../../config/rollup";
import { name, version, author, dependencies } from "../package.json";

export default [
    "src/index.js",
    "src/toArray.js",
].map((input) => configure({
    input,
    name,
    version,
    author,
    dependencies
}));
