import configure from "../../../config/rollup";
import { name, version, author, dependencies } from "../package.json";

export default configure({
	input: "src/index.js",
	name,
	version,
	author,
	dependencies,
});
