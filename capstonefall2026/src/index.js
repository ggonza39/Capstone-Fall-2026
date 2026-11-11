import { enhanceStaticHome } from "./home/enhanceStaticHome";
import "./styles/base.css";
import "./pages/Home.css";
import "./components/SiteShell.css";

const root = document.getElementById("root");
const hasStaticHome = process.env.NODE_ENV === "production"
    && window.location.pathname === "/"
    && root?.dataset.prerendered === "home";

if (hasStaticHome) {
    enhanceStaticHome();
} else {
    // Development and secondary pages retain the complete application. This
    // starts as soon as their document loads; no idle timer delays the page.
    const status = document.createElement("div");
    status.className = "site-page-loading";
    status.setAttribute("role", "status");
    status.textContent = "Loading page…";
    root.replaceChildren(status);
    import("./reactApp").catch((error) => {
        console.error("The application could not load:", error);
        status.setAttribute("role", "alert");
        status.textContent = "The page could not load. ";
        const retry = document.createElement("a");
        retry.href = window.location.href;
        retry.textContent = "Reload page";
        status.append(retry);
    });
}
