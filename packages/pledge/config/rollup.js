import configure from "../../../config/rollup";
import { name, version, author, dependencies } from "../package.json";

export default [
    "src/index.js",
    "src/constants.js"
].map((input) => configure({
    input,
    name,
    version,
    author,
    dependencies
}));
