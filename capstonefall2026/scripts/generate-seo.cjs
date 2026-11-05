const fs = require("node:fs");
const path = require("node:path");
const seoConfig = require("../src/seo/config.json");
const { resolveSiteOrigin } = require("../src/seo/siteOrigin.js");

function escapeXml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
    }[character]));
}

function generateSeoFiles({
    siteOrigin = process.env.REACT_APP_SITE_URL || seoConfig.siteOrigin,
    outputDirectory = path.resolve(__dirname, "../public"),
} = {}) {
    const origin = resolveSiteOrigin(siteOrigin);
    const urls = Object.keys(seoConfig.routes).map((pathname) => `${origin}${pathname}`);
    const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
        "</urlset>",
        "",
    ].join("\n");
    const robots = `User-agent: *\nDisallow:\n\nSitemap: ${origin}/sitemap.xml\n`;

    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(path.join(outputDirectory, "sitemap.xml"), sitemap);
    fs.writeFileSync(path.join(outputDirectory, "robots.txt"), robots);

    return { siteOrigin: origin, urls, sitemap, robots };
}

if (require.main === module) {
    process.chdir(path.resolve(__dirname, ".."));
    // Match CRA's .env precedence so runtime canonicals and the sitemap agree.
    process.env.NODE_ENV = process.argv[2] || "production";
    require("react-scripts/config/env");
    const { urls } = generateSeoFiles();
    process.stdout.write(`Generated SEO crawl files for ${urls.length} public routes.\n`);
}

module.exports = { generateSeoFiles };
