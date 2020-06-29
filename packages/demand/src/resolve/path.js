import resolveUrl from "./url";
import matchRelative from "../regex/matchRelative";
import matchBase from "../regex/matchBase";
import matchParameter from "../regex/matchParameter";
import matchLeadingSlash from "../regex/matchLeadingSlash";

/**
 * Resolves a path from a given uri and context
 *
 * @param {String} uri
 * @param {String} [context]
 *
 * @returns {String}
 */
export default function resolvePath(uri, context) {
    let path = uri.replace(matchParameter, "");

    if (matchRelative.test(path)) {
        path = resolveUrl(
            ((context && resolveUrl(context + "/../")) || "/") + path
        ).replace(matchBase, matchLeadingSlash.test(context) ? "/" : "");
    }

    return path;
}
