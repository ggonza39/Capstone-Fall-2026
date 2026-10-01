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

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <App />
    </ThemeProvider>
  </React.StrictMode>
);
