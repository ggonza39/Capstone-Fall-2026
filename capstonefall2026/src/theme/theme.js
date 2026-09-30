import { createTheme } from "@mui/material/styles";

/**
 * PBI-10 Implement responsive frontend layout and 150% zoom support
 *
 * Responsive Layout Behavior: Implement responsive layouts across the planned desktop,
 * tablet, and mobile viewport ranges, including verification at 980px and below. 
 * Content and navigation must reflow without major overlap, clipping, or unusable 
 * interface elements.
 *
 * 150% Zoom Verification: Verify that the interface remains usable through 150% browser 
 * zoom without overlapping logos, text crowding, broken navigation, truncated essential 
 * content, or inaccessible interactive controls.
 *
 * Usable Interactive Controls: Ensure buttons, form controls, navigation controls, and 
 * other interactive elements provide clear and usable activation targets appropriate for 
 * the senior-focused interface across supported screen sizes.
 * 
 * Scalable Layout Implementation: Use responsive CSS techniques and appropriate relative/scalable 
 * units for typography, spacing, and layout where needed to support content reflow, responsive 
 * behavior, and 150% zoom stability.
 * 
 * Cross-Browser Responsive Verification: Test the implemented responsive layouts and applicable 
 * zoom behavior across the project's supported modern browsers, including Chrome, Firefox, 
 * Safari, and Edge where available.
 * 
 * Baseline Responsive Defect Verification: Verify that the previously documented responsive
 * issues—including logo/navigation overlap and text/layout crowding associated with smaller
 * viewports and 150% zoom—are addressed in the implemented frontend.
 * 
 */

const theme = createTheme({
    palette: {
        primary: {
            main: "#1F70B1",
            contrastText: "#FFFFFF",
        },

        secondary: {
            main: "#F5B148",
            contrastText: "#222222",
        },

        background: {
            default: "#FFFFFF",
            paper: "#F7F7F7",
        },

        text: {
            primary: "#222222",
            secondary: "#444444",
        },

        error: {
            main: "#B00020",
        },

        success: {
            main: "#2E6B3E",
        },
    },

    typography: {
        fontFamily: '"Bilo", Arial, sans-serif',

        fontSize: 18,

        h1: {
            fontFamily: '"Rockwell", Georgia, serif',
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            lineHeight: 1.2,
        },

        h2: {
            fontFamily: '"Rockwell", Georgia, serif',
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            lineHeight: 1.25,
        },

        h3: {
            fontFamily: '"Rockwell", Georgia, serif',
            fontWeight: 700,
            fontSize: "1.5rem",
            lineHeight: 1.3,
        },

        body1: {
            fontSize: "1.125rem",
            lineHeight: 1.6,
        },

        body2: {
            fontSize: "1rem",
            lineHeight: 1.6,
        },

        button: {
            fontSize: "1.125rem",
            fontWeight: 700,
            textTransform: "none",
        },
    },

    shape: {
        borderRadius: 6,
    },

    components: {
        /* Global accessibility rules */
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    scrollPaddingTop: "120px",
                },

                body: {
                    margin: 0,
                },

                img: {
                    maxWidth: "100%",
                    height: "auto",
                },

                "*:focus-visible": {
                    outline: "3px solid #000000",
                    outlineOffset: "4px",
                },

                "@media (prefers-reduced-motion: reduce)": {
                    "*, *::before, *::after": {
                        animationDuration: "0.01ms !important",
                        animationIterationCount: "1 !important",
                        transitionDuration: "0.01ms !important",
                        scrollBehavior: "auto !important",
                    },
                },
            },
        },

        /* Buttons */
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },

            styleOverrides: {
                root: {
                    minHeight: "48px",
                    minWidth: "48px",
                    padding: "10px 20px",
                    fontWeight: 700,
                },
            },
        },

        /* Icon buttons */
        MuiIconButton: {
            styleOverrides: {
                root: {
                    minWidth: "48px",
                    minHeight: "48px",
                },
            },
        },

        /* Text fields */
        MuiTextField: {
            defaultProps: {
                variant: "outlined",
                fullWidth: true,
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    minHeight: "48px",
                    fontSize: "1.125rem",
                },
            },
        },

        /* Links */
        MuiLink: {
            styleOverrides: {
                root: {
                    textUnderlineOffset: "3px",
                },
            },
        },
    },
});

export default theme;
