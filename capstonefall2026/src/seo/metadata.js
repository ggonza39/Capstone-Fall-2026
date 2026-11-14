import seoConfig from "./config.json";
import siteOriginHelpers from "./siteOrigin";

export const { resolveSiteOrigin } = siteOriginHelpers;

const siteOrigin = resolveSiteOrigin(process.env.REACT_APP_SITE_URL || seoConfig.siteOrigin);

export function getRouteMetadata(pathname = "/") {
    const pathWithoutSearch = pathname.split(/[?#]/, 1)[0] || "/";
    const path = pathWithoutSearch.replace(/\/+$/, "") || "/";
    const staticPath = path.toLowerCase();
    if (staticPath === "/admin" || staticPath.startsWith("/admin/")) {
        return {
            title: staticPath === "/admin/login" ? "Admin Login | TechSmart Sandbox" : "Administration | TechSmart Sandbox",
            description: "TechSmart sandbox administration demonstration for testing workshop and informational content workflows.",
            canonical: null,
            robots: "noindex,nofollow",
        };
    }
    const route = seoConfig.routes[staticPath];
    const workshop = /^\/workshops\/([^/]+)$/i.exec(path);

    if (!route && !workshop) {
        return { ...seoConfig.notFound, canonical: null, robots: "noindex,follow" };
    }

    return {
        ...(route || seoConfig.workshop),
        canonical: `${siteOrigin}${route ? staticPath : `/workshops/${workshop[1]}`}`,
        robots: "index,follow",
    };
}

function singleHeadElement(selector, tagName) {
    const [existing, ...duplicates] = document.head.querySelectorAll(selector);
    duplicates.forEach((node) => node.remove());

    if (existing) {
        return existing;
    }

    const element = document.createElement(tagName);
    document.head.appendChild(element);
    return element;
}

export function applyPageMetadata({ title, description, canonical, robots }) {
    singleHeadElement("title", "title").textContent = title;

    const descriptionTag = singleHeadElement('meta[name="description" i]', "meta");
    descriptionTag.setAttribute("name", "description");
    descriptionTag.setAttribute("content", description);

    const robotsTag = singleHeadElement('meta[name="robots" i]', "meta");
    robotsTag.setAttribute("name", "robots");
    robotsTag.setAttribute("content", robots);

    if (canonical) {
        const canonicalTag = singleHeadElement('link[rel~="canonical" i]', "link");
        canonicalTag.setAttribute("rel", "canonical");
        canonicalTag.setAttribute("href", canonical);
    } else {
        document.head.querySelectorAll('link[rel~="canonical" i]').forEach((node) => node.remove());
    }
}
