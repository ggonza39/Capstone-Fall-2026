import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

// This module is loaded with a secondary page or the on-demand mobile drawer.
// Existing MUI pages keep their complete theme and accessibility overrides.
export default function PageTheme({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
