const resolver = document.createElement("a");

export default function resolveUrl(url) {
    resolver.href = url;

    return resolver.href;
}
