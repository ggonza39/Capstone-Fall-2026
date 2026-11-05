import { useCallback, useEffect, useRef, useState } from "react";

import { Link as RouterLink, useLocation } from "react-router-dom";

import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import logo from "../assets/techsmartLogo.webp";
import { loadMobileNavigation } from "./mobileNavigationLoader";

const navigation = [
    {
        label: "Home",
        path: "/",
    },
    {
        label: "I Need Technology Help",
        path: "/need-help",
    },
    {
        label: "I Want to Help",
        path: "/want-to-help",
    },
    {
        label: "Resources",
        path: "/resources",
    },
    {
        label: "About",
        path: "/about",
    },
    {
        label: "Contact",
        path: "/contact",
    },
];

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuLoading, setMenuLoading] = useState(false);
    const [menuError, setMenuError] = useState("");
    const [MobileNavigationComponent, setMobileNavigationComponent] = useState(null);
    const menuButtonRef = useRef(null);
    const requestIdRef = useRef(0);
    const mountedRef = useRef(true);

    const location = useLocation();

    const closeMenu = useCallback(() => {
        requestIdRef.current += 1;
        setMenuOpen(false);
        setMenuLoading(false);
        setMenuError("");
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            requestIdRef.current += 1;
        };
    }, []);

    useEffect(() => {
        closeMenu();
    }, [location.key, closeMenu]);

    useEffect(() => {
        if (!menuLoading && !menuError) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                menuButtonRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [menuLoading, menuError, closeMenu]);

    const openMenu = async () => {
        const requestId = ++requestIdRef.current;
        menuButtonRef.current?.focus();
        setMenuError("");
        setMenuOpen(true);

        if (MobileNavigationComponent) {
            return;
        }

        setMenuLoading(true);

        try {
            const navigationModule = await loadMobileNavigation();
            if (!mountedRef.current) {
                return;
            }

            setMobileNavigationComponent(() => navigationModule.default);
            if (requestId === requestIdRef.current) {
                setMenuLoading(false);
            }
        } catch {
            if (mountedRef.current && requestId === requestIdRef.current) {
                setMenuLoading(false);
                setMenuOpen(false);
                setMenuError("The navigation menu could not load. Please try again.");
            }
        }
    };

    const toggleMenu = () => {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    return (
        <>
            <AppBar
                position="sticky"
                color="inherit"
                elevation={0}
                component="header"
                sx={{
                    backgroundColor: "#FFFFFF",

                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        disableGutters
                        sx={{
                            minHeight: {
                                xs: 80,
                                md: 100,
                            },

                            justifyContent: "space-between",

                            gap: 2,
                        }}
                    >
                        <Box
                            component={RouterLink}
                            to="/"
                            onClick={closeMenu}
                            aria-label="TechSmart Learning for Seniors home"
                            sx={{
                                display: "inline-flex",
                                alignItems: "center",

                                flexShrink: 0,
                            }}
                        >
                            <Box
                                component="img"
                                src={logo}
                                alt="TechSmart Learning for Seniors"
                                width={500}
                                height={250}
                                loading="eager"
                                fetchPriority="high"
                                sx={{
                                    width: {
                                        xs: 190,
                                        sm: 220,
                                        md: 260,
                                    },

                                    height: "auto",
                                }}
                            />
                        </Box>

                        {/* DESKTOP VIEW NAVIGATION LINKS */}

                        <Box
                            component="nav"
                            aria-label="Main navigation"
                            sx={{
                                display: {
                                    xs: "none",
                                    lg: "flex",
                                },

                                alignItems: "center",

                                gap: 0.5,
                            }}
                        >
                            {navigation.map((item) => {
                                const active = location.pathname === item.path;

                                return (
                                    <Button
                                        key={item.path}
                                        component={RouterLink}
                                        to={item.path}
                                        color="inherit"
                                        aria-current={active ? "page" : undefined}
                                        sx={{
                                            color: active ? "primary.main" : "text.primary",

                                            textDecoration: active ? "underline" : "none",

                                            textDecorationThickness: "3px",

                                            textUnderlineOffset: "6px",

                                            whiteSpace: "nowrap",

                                            "&:focus-visible": {
                                                outline: "3px solid #000000",
                                                outlineOffset: "4px",
                                                borderRadius: "4px",
                                            },

                                            "&:hover": {
                                                color: "primary.main",

                                                textDecoration: "underline",

                                                textDecorationThickness: "3px",

                                                textUnderlineOffset: "6px",
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                );
                            })}
                        </Box>

                        {/* MOBILE/TABLET MENU BUTTON */}

                        <Button
                            ref={menuButtonRef}
                            onClick={toggleMenu}
                            aria-label={menuLoading ? "Loading navigation menu" : menuOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-busy={menuLoading}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                            startIcon={menuLoading ? <CircularProgress size={20} color="inherit" aria-label="Loading navigation menu" /> : menuOpen ? <CloseIcon /> : <MenuIcon />}
                            variant="contained"
                            data-uniform-size="false"
                            sx={{
                                // Keep navigation compact beside the logo on small screens.
                                width: "auto",
                                minWidth: 48,
                                minHeight: 48,
                                flexShrink: 0,
                                whiteSpace: "nowrap",
                                display: {
                                    xs: "inline-flex",
                                    lg: "none",
                                },
                            }}
                        >
                            Menu
                        </Button>
                    </Toolbar>
                </Container>
                {menuError && (
                    <Box
                        role="alert"
                        sx={{
                            position: "absolute",
                            top: "100%",
                            right: 2,
                            width: 320,
                            maxWidth: "calc(100vw - 32px)",
                            p: 2,
                            backgroundColor: "background.paper",
                            color: "text.primary",
                            boxShadow: 3,
                        }}
                    >
                        <Typography>{menuError}</Typography>
                        <Button onClick={openMenu}>Retry</Button>
                        <Button onClick={() => {
                            closeMenu();
                            menuButtonRef.current?.focus();
                        }}>Dismiss</Button>
                    </Box>
                )}
            </AppBar>

            {/* MOBILE/TABLET VIEW NAVIGATION LINKS */}

            {MobileNavigationComponent && (
                <MobileNavigationComponent
                    open={menuOpen}
                    onClose={closeMenu}
                    navigation={navigation}
                    pathname={location.pathname}
                />
            )}
        </>
    );
}

export default Header;
