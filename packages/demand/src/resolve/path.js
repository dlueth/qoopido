import resolveUrl from "./url";
import { isRelative, matchBase, matchParameter } from "../regex";

export default function resolvePath(uri, context) {
    let path = uri.replace(matchParameter, '');

    if(isRelative.test(path)) {
        path = '/' + resolveUrl(((context && resolveUrl(context + '/../')) || '/') + path).replace(matchBase, '');
    }

    return path;
}
