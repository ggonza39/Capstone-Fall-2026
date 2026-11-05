// Shared by the browser metadata and the build-time sitemap generator.
function resolveSiteOrigin(value) {
    const candidate = typeof value === "string" ? value.trim() : "";
    let url;

    try {
        url = new URL(candidate);
    } catch {
        throw new Error("REACT_APP_SITE_URL must be an absolute HTTP or HTTPS site origin.");
    }

    if (
        !/^https?:\/\/[^/?#\\\s]+\/?$/i.test(candidate) ||
        !["http:", "https:"].includes(url.protocol) ||
        url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash
    ) {
        throw new Error("REACT_APP_SITE_URL must contain only an HTTP or HTTPS origin, without a path, query, fragment, or credentials.");
    }

    return url.origin;
}

module.exports = { resolveSiteOrigin };
