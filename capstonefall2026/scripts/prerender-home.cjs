const fs = require("node:fs");
const path = require("node:path");

const appDirectory = path.resolve(__dirname, "..");
const sourceDirectory = path.join(appDirectory, "src");
const prerenderedRoot = /<div\b[^>]*\bid=(['"])root\1[^>]*\bdata-prerendered=(['"])home\2[^>]*>/i;

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    }[character]));
}

function replaceExactlyOnce(value, expression, replacement, description) {
    const matches = [...value.matchAll(new RegExp(expression.source, `${expression.flags.replace("g", "")}g`))];
    if (matches.length !== 1) {
        throw new Error(`Homepage prerender expected one ${description}; found ${matches.length}.`);
    }
    return value.replace(expression, replacement);
}

// Keep the initial form usable before its small enhancement script loads. The
// controller enables noValidate only after it installs the inline-error handler.
function addNativeFormFallback(markup) {
    let searchFormCount = 0;
    const result = markup.replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, (form) => {
        if (!/\bid=["']home-zip-code["']/.test(form)) return form;
        searchFormCount += 1;
        if (!form.includes('action="/need-help"') || !form.includes('method="get"') ||
            !form.includes('name="zip"') || !form.includes('required=""') || !form.includes('pattern="[0-9]{5}"')) {
            throw new Error("The shared workshop form must provide its GET action and ZIP constraints before prerendering.");
        }
        return form.replace(/^<form\b[^>]*>/i, (openingTag) =>
            openingTag.replace(/\snovalidate(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?(?=\s|>)/gi, ""));
    });
    if (searchFormCount !== 1) {
        throw new Error(`Homepage prerender expected one workshop search form; found ${searchFormCount}.`);
    }
    return result;
}

function installSourceLoader(manifest) {
    const babel = require("@babel/core");
    const originals = new Map();
    const register = (extension, handler) => {
        originals.set(extension, require.extensions[extension]);
        require.extensions[extension] = handler;
    };
    const originalJavaScript = require.extensions[".js"];

    // This standalone build process compiles only our source tree. Dependencies
    // continue to use Node's normal loader; nothing is changed in the CRA build.
    register(".js", (module, filename) => {
        const relative = path.relative(sourceDirectory, filename);
        if (relative.startsWith(`..${path.sep}`) || relative === ".." || path.isAbsolute(relative)) {
            return originalJavaScript(module, filename);
        }
        const transformed = babel.transformFileSync(filename, {
            babelrc: false,
            configFile: false,
            presets: [
                [require.resolve("@babel/preset-env"), { targets: { node: "current" }, modules: "commonjs" }],
                [require.resolve("@babel/preset-react"), { runtime: "automatic" }],
            ],
        });
        if (!transformed?.code) throw new Error(`Could not compile homepage source: ${filename}`);
        module._compile(transformed.code, filename);
    });
    register(".css", (module) => { module.exports = {}; });

    for (const extension of [".webp", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".avif"]) {
        register(extension, (module, filename) => {
            const key = `static/media/${path.basename(filename)}`;
            const emittedUrl = manifest.files[key];
            if (typeof emittedUrl !== "string" || !emittedUrl) {
                throw new Error(`Homepage asset is missing from the production manifest: ${key}`);
            }
            module.exports = emittedUrl;
        });
    }

    return () => {
        for (const [extension, original] of originals) {
            if (original) require.extensions[extension] = original;
            else delete require.extensions[extension];
        }
    };
}

function renderHomepage(manifest) {
    const restoreLoaders = installSourceLoader(manifest);
    try {
        const React = require("react");
        const { renderToStaticMarkup } = require("react-dom/server");
        const { StaticRouter, Routes, Route } = require("react-router-dom");
        const MainLayout = require("../src/layouts/MainLayout").default;
        const Home = require("../src/pages/Home").default;
        const { getRouteMetadata } = require("../src/seo/metadata");

        const tree = React.createElement(StaticRouter, { location: "/" },
            React.createElement(Routes, null,
                React.createElement(Route, { element: React.createElement(MainLayout) },
                    React.createElement(Route, { path: "/", element: React.createElement(Home) }))));
        const rendered = renderToStaticMarkup(tree);
        // React 19 emits high-priority image hints before the root component.
        // Put those hints in the document head, outside the application root.
        const preloadHints = [];
        const markup = rendered.replace(/^((?:<link\b[^>]*rel="preload"[^>]*\/?>)+)/i, (hints) => {
            preloadHints.push(hints);
            return "";
        });
        if (!markup.includes('class="site-app"') || !markup.includes('id="main-content"')) {
            throw new Error("Homepage prerender did not produce the shared layout and main content.");
        }
        return { markup: addNativeFormFallback(markup), metadata: getRouteMetadata("/"), preloadHints };
    } finally {
        restoreLoaders();
    }
}

function prerenderHome() {
    process.env.NODE_ENV = "production";
    process.env.BABEL_ENV = "production";
    const previousDirectory = process.cwd();
    process.chdir(appDirectory);
    try {
        // Use CRA's .env precedence, PUBLIC_URL and optional BUILD_PATH so the
        // generated document agrees with the client bundle and SEO sitemap.
        require("react-scripts/config/env");
        const buildDirectory = require("react-scripts/config/paths").appBuild;
        const manifestPath = path.join(buildDirectory, "asset-manifest.json");
        const indexPath = path.join(buildDirectory, "index.html");
        const appPath = path.join(buildDirectory, "app.html");
        const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        if (!manifest.files || !Array.isArray(manifest.entrypoints)) {
            throw new Error("Homepage prerender requires a complete CRA production asset manifest.");
        }
        const existingIndex = fs.readFileSync(indexPath, "utf8");
        // Re-running this postbuild step uses the preserved CSR document, not
        // already-rendered markup, so content and image hints cannot nest.
        const template = prerenderedRoot.test(existingIndex)
            ? fs.readFileSync(appPath, "utf8")
            : existingIndex;
        if (prerenderedRoot.test(template)) {
            throw new Error("The preserved app.html must contain the original empty CRA root.");
        }
        const rootExpression = /<div\b(?=[^>]*\bid=["']root["'])[^>]*>\s*<\/div>/i;
        const { markup, metadata, preloadHints } = renderHomepage(manifest);
        let homepage = replaceExactlyOnce(template, rootExpression,
            () => `<div id="root" data-prerendered="home">${markup}</div>`, "empty CRA root");
        homepage = replaceExactlyOnce(homepage, /<title\b[^>]*>[\s\S]*?<\/title>/i,
            () => `<title>${escapeHtml(metadata.title)}</title>`, "page title");
        homepage = replaceExactlyOnce(homepage, /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i,
            () => `<meta name="description" content="${escapeHtml(metadata.description)}">`, "page description");
        homepage = homepage
            .replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, "")
            .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, "");
        const headAdditions = [
            // Keep skip navigation visible on focus even if enhancement JS fails.
            '<style>a[href="#main-content"]:focus{top:16px!important}</style>',
            `<meta name="robots" content="${escapeHtml(metadata.robots)}">`,
            `<link rel="canonical" href="${escapeHtml(metadata.canonical)}">`,
            ...preloadHints,
        ].join("");
        homepage = replaceExactlyOnce(homepage, /<\/head>/i,
            () => `${headAdditions}</head>`, "document head");

        fs.writeFileSync(appPath, template);
        fs.writeFileSync(indexPath, homepage);
        process.stdout.write("Prerendered the homepage; preserved the React app fallback in app.html.\n");
    } finally {
        process.chdir(previousDirectory);
    }
}

if (require.main === module) prerenderHome();

module.exports = { prerenderHome };
