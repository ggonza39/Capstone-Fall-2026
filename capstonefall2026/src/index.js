import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import theme from "./theme/theme";

/**
 * PBI-12: Mock API / sandbox integration.
 *
 * Local development:
 *   MSW is enabled by default.
 *
 * Deployed sandbox:
 *   Set REACT_APP_ENABLE_MOCKS=true before building.
 *
 * Real production:
 *   Leave REACT_APP_ENABLE_MOCKS unset or set it to false.
 *
 * REACT_APP_ENABLE_MOCKS is embedded at build time by
 * Create React App.
 */
async function enableMocking() {
  const isDevelopment = process.env.NODE_ENV === "development";

  const isSandboxBuild =
    process.env.REACT_APP_ENABLE_MOCKS === "true";

  const shouldEnableMocking = isDevelopment || isSandboxBuild;

  if (!shouldEnableMocking) {
    return;
  }

  const { worker } = await import("./mocks/browser");

  await worker.start({
    onUnhandledRequest: "bypass",
    serviceWorker: {
      url: `${process.env.PUBLIC_URL || ""}/mockServiceWorker.js`,
    },
  });
}

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

enableMocking()
  .then(() => {
    root.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error("Mock Service Worker failed to start:", error);

    root.render(
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </React.StrictMode>
    );
  });