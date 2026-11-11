import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// The React application is needed immediately on secondary routes. The static
// homepage has its own small controller and does not initialize this renderer.
async function enableMocking() {
    if (process.env.NODE_ENV !== "development" && process.env.REACT_APP_ENABLE_MOCKS !== "true") {
        return;
    }
    const { worker } = await import("./mocks/browser");
    await worker.start({
        onUnhandledRequest: "bypass",
        serviceWorker: { url: `${process.env.PUBLIC_URL || ""}/mockServiceWorker.js` },
    });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
function renderApplication() {
    root.render(<React.StrictMode><App /></React.StrictMode>);
}

enableMocking().then(renderApplication).catch((error) => {
    console.error("Mock Service Worker failed to start:", error);
    renderApplication();
});
