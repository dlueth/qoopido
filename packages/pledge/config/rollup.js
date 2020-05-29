import { configure, configureTemp } from "../../../config/rollup";
import { name, version, author, dependencies } from "../package.json";

const dist = [
        "src/index.js"
    ].map((input) => configure({
        input,
        name,
        version,
        author,
        dependencies
    }));

const temp =  [
        "src/constant.js"
    ].map((input) => configureTemp({
        input,
        name,
        version,
        author,
        dependencies
    }));

export default dist.concat(temp);
