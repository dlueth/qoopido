const resolver = document.createElement("a");

/**
 * Resolves an URL
 *
 * @param {String} url
 *
 * @returns {String}
 */
export default function resolveUrl(url) {
    resolver.href = url;

    return resolver.href;
}
