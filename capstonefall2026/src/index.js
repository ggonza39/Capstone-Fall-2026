import React from 'react';
import ReactDOM from 'react-dom/client';


import {
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import App from "./App";
import theme from "./theme/theme";

// Example call using API Client method
// const result = createVolunteerInquiry({firstName: "Jake", lastName: "Schramm", email: "junkemail@yahoo.com", reasonForVolunteering: "Event volunteer"});
// console.log(result);

/**
 * Sandbox/MSW boundary (PBI-12).
 *
 * Starts the Mock Service Worker only in local development builds so that
 * frontend requests to /api/* (e.g. workshop search/details/registration)
 * are intercepted by src/mocks/handlers.js instead of hitting a real
 * backend. Production builds skip this entirely. See mocks/README.md and
 * documentation/api-contract.md for the full integration-boundary notes.
 */
async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  return worker.start({ onUnhandledRequest: "bypass" });
}

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

enableMocking().then(() => {
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
});
