import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

import SkipLink from "../components/SkipLink";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import ScrollToTop from "../components/ScrollToTop";

/**
 * PBI-6 Implement dual-path landing and navigation.
 * 
 * Accessible Global Header: Build a consistent header containing the site 
 * logo and clear primary navigation to the site's major resources and user 
 * pathways. Navigation controls must be keyboard accessible, visibly focusable, 
 * and usable across the planned responsive layouts.
 * 
 * Global Accessible Footer: Build a consistent footer containing applicable
 * organization contact information and secondary navigation links that provide
 * direct access to important site resources.
 * 
 * Skip Navigation Link: Implement a hidden "Skip to main content" link at the
 * top of the DOM that becomes visible on keyboard focus and moves focus directly
 * to the <main> element.
 */
function MainLayout() {
    return (
        <Box
            sx={{
                minHeight: "100vh",

                display: "flex",

                flexDirection: "column",

                paddingBottom: {
                    xs: "calc(80px + env(safe-area-inset-bottom))",
                    md: 0,
                },
            }}
        >
            <ScrollToTop />{/* Scroll to top of page when selecting bottom navigation button */}

            <SkipLink /> {/* Skip to main content link for accessibility */}

            <Header />

            <Box
                component="main"
                id="main-content"
                tabIndex={-1}
                sx={{
                    flexGrow: 1,
                }}
            >
                <Outlet />
            </Box>

            <Footer />
            <MobileBottomNav />
        </Box>
    );
}

export default MainLayout;
