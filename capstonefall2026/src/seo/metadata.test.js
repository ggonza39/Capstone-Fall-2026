import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter } from "react-router-dom";
import seoConfig from "./config.json";
import RouteMetadata from "./RouteMetadata";
import { applyPageMetadata, getRouteMetadata, resolveSiteOrigin } from "./metadata";

let originalHead;
const siteOrigin = resolveSiteOrigin(process.env.REACT_APP_SITE_URL || seoConfig.siteOrigin);

beforeEach(() => {
    originalHead = document.head.innerHTML;
    document.head.innerHTML = "";
});

afterEach(() => {
    document.head.innerHTML = originalHead;
});

test("all eight public pages have distinct descriptive titles, descriptions, and canonicals", () => {
    const metadata = Object.keys(seoConfig.routes).map((route) => getRouteMetadata(route));

    expect(metadata).toHaveLength(8);
    expect(new Set(metadata.map((page) => page.title)).size).toBe(8);
    expect(new Set(metadata.map((page) => page.description)).size).toBe(8);
    expect(new Set(metadata.map((page) => page.canonical)).size).toBe(8);
    metadata.forEach((page) => {
        expect(page.title).toMatch(/TechSmart/);
        expect(page.title).not.toMatch(/React App/);
        expect(page.description.length).toBeGreaterThan(50);
        expect(page.robots).toBe("index,follow");
    });
});

test.each([
    ["/?source=home#top", "/"],
    ["/need-help/?zip=01234#workshops", "/need-help"],
    ["/want-to-help#donate", "/want-to-help"],
    ["/ADVOCATE/?source=help#form", "/advocate"],
    ["/resources///?topic=smartphones", "/resources"],
    ["/ABOUT/", "/about"],
    ["/NEED-HELP?zip=01234", "/need-help"],
])("%s canonicalizes to %s without query, fragment, or duplicate trailing slashes", (input, route) => {
    expect(getRouteMetadata(input)).toEqual({
        ...seoConfig.routes[route],
        canonical: `${siteOrigin}${route}`,
        robots: "index,follow",
    });
});

test("workshop paths get a self canonical while missing routes stay out of the index", () => {
    expect(getRouteMetadata("/workshops/WS-1001/?source=search#register")).toEqual({
        ...seoConfig.workshop,
        canonical: `${siteOrigin}/workshops/WS-1001`,
        robots: "index,follow",
    });
    expect(getRouteMetadata("/WORKSHOPS/WS-1001")).toEqual({
        ...seoConfig.workshop,
        canonical: `${siteOrigin}/workshops/WS-1001`,
        robots: "index,follow",
    });
    ["/not-a-page", "/workshops", "/workshops/WS-1001/extra"].forEach((route) => {
        expect(getRouteMetadata(route)).toEqual({
            ...seoConfig.notFound,
            canonical: null,
            robots: "noindex,follow",
        });
    });
});

test("metadata updates remove duplicate head tags and preserve unrelated metadata", () => {
    document.head.innerHTML = `
        <title>Old title</title><title>Duplicate title</title>
        <meta name="Description" content="Old description"><meta name="description" content="Duplicate description">
        <meta name="ROBOTS" content="noindex"><meta name="robots" content="nofollow">
        <link rel="alternate canonical" href="https://old.example/"><link rel="CANONICAL" href="https://duplicate.example/">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" href="/favicon.ico">
    `;
    const resources = getRouteMetadata("/resources");
    applyPageMetadata(resources);
    applyPageMetadata(resources);

    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(document.title).toBe(resources.title);
    expect(document.head.querySelectorAll('meta[name="description" i]')).toHaveLength(1);
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute("content", resources.description);
    expect(document.head.querySelectorAll('meta[name="robots" i]')).toHaveLength(1);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
    expect(document.head.querySelectorAll('link[rel~="canonical" i]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", resources.canonical);
    expect(document.head.querySelector('meta[name="viewport"]')).toHaveAttribute("content", "width=device-width, initial-scale=1");
    expect(document.head.querySelector('link[rel="icon"]')).toHaveAttribute("href", "/favicon.ico");

    applyPageMetadata(getRouteMetadata("/not-a-page"));
    expect(document.head.querySelectorAll('link[rel~="canonical" i]')).toHaveLength(0);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");

    applyPageMetadata(getRouteMetadata("/"));
    expect(document.head.querySelectorAll('link[rel~="canonical" i]')).toHaveLength(1);
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "index,follow");
});

test("client route changes replace metadata without retaining a previous page canonical", async () => {
    render(
        <MemoryRouter initialEntries={["/need-help?zip=01234#workshops"]}>
            <RouteMetadata />
            <Link to="/resources">Browse resources</Link>
            <Link to="/not-a-page">Missing page</Link>
        </MemoryRouter>
    );

    await waitFor(() => expect(document.title).toBe(seoConfig.routes["/need-help"].title));
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/need-help`);

    userEvent.click(screen.getByRole("link", { name: "Browse resources" }));
    await waitFor(() => expect(document.title).toBe(seoConfig.routes["/resources"].title));
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute("href", `${siteOrigin}/resources`);

    userEvent.click(screen.getByRole("link", { name: "Missing page" }));
    await waitFor(() => expect(document.title).toBe(seoConfig.notFound.title));
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelectorAll("title")).toHaveLength(1);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
});

test.each([
    ["  https://techsmart.example/  ", "https://techsmart.example"],
    ["http://localhost:4173/", "http://localhost:4173"],
    [seoConfig.siteOrigin, seoConfig.siteOrigin],
])("site origin %s normalizes to %s", (input, expected) => {
    expect(resolveSiteOrigin(input)).toBe(expected);
});

test.each([
    undefined, "", "/relative", "ftp://techsmart.example", "https:techsmart.example",
    "https://techsmart.example/resources", "https://techsmart.example/..",
    "https://techsmart.example?zip=01234", "https://techsmart.example?",
    "https://techsmart.example#home", "https://techsmart.example#",
    "https://person:password@techsmart.example", "https://techsmart.example\\resources",
])("site origin rejects %s so runtime canonicals and the sitemap cannot target an invalid base", (input) => {
    expect(() => resolveSiteOrigin(input)).toThrow(/REACT_APP_SITE_URL/);
});

test("configured deployment origin is used by runtime canonical metadata", () => {
    const previous = process.env.REACT_APP_SITE_URL;
    process.env.REACT_APP_SITE_URL = "https://preview.techsmart.example/";
    try {
        jest.isolateModules(() => {
            const { getRouteMetadata: getPreviewMetadata } = require("./metadata");
            expect(getPreviewMetadata("/contact?ref=footer").canonical).toBe("https://preview.techsmart.example/contact");
        });
    } finally {
        if (previous === undefined) delete process.env.REACT_APP_SITE_URL;
        else process.env.REACT_APP_SITE_URL = previous;
    }
});

test("crawl-file generation uses the configured public routes and excludes demonstration workshops", () => {
    const fs = require("node:fs");
    const { generateSeoFiles } = require("../../scripts/generate-seo.cjs");
    const mkdir = jest.spyOn(fs, "mkdirSync").mockImplementation(() => undefined);
    const write = jest.spyOn(fs, "writeFileSync").mockImplementation(() => undefined);
    try {
        const result = generateSeoFiles({ siteOrigin: "https://preview.techsmart.example/", outputDirectory: "seo-test-output" });
        const expected = Object.keys(seoConfig.routes).map((route) => `https://preview.techsmart.example${route}`);
        expect(result.urls).toEqual(expected);
        expect(result.urls).toHaveLength(8);
        expect(result.sitemap).toContain("<loc>https://preview.techsmart.example/advocate</loc>");
        expect(result.sitemap).not.toContain("/workshops/");
        expected.forEach((url) => expect(result.sitemap).toContain(`<loc>${url}</loc>`));
        expect(result.robots).toContain("User-agent: *\nDisallow:\n");
        expect(result.robots).toContain("Sitemap: https://preview.techsmart.example/sitemap.xml");
        expect(write).toHaveBeenCalledTimes(2);
    } finally {
        mkdir.mockRestore();
        write.mockRestore();
    }
});
