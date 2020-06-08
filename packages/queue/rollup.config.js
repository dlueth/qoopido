import { configure } from "../../rollup.config.js";
import { name, version, author, dependencies } from "./package.json";

export default [
    "src/index.js"
].map((input) => configure({
    input,
    name,
    version,
    author,
    dependencies
}));
