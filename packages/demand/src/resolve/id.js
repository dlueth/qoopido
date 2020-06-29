import settings from "../settings";
import { DEFAULT_HANDLER } from "../constant";
import matchParameter from "../regex/matchParameter";
import resolvePath from "./path";

/**
 * Resolves an ID from a given uri and context
 *
 * @param {String} uri
 * @param {String} [context]
 *
 * @returns {String}
 */
export default function resolveId(uri, context) {
    const parameter = uri.match(matchParameter);

    return (
        (parameter && parameter[1] ? "mock:" : "") +
        ((parameter && parameter[3]) || DEFAULT_HANDLER) +
        "!" +
        resolvePath(uri, context)
    );
}
