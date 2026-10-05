import { useState } from "react";

import { Link as RouterLink, useLocation } from "react-router-dom";

import {
    AppBar,
    Toolbar,
    Container,
    Box,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import logo from "../assets/techsmartLogo.png";

const navigation = [
    {
        label: "Home",
        path: "/",
    },
    {
        label: "I Need Help",
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

    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen((previous) => !previous);
    };

    const closeMenu = () => {
        setMenuOpen(false);
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
                            onClick={toggleMenu}
                            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                            startIcon={menuOpen ? <CloseIcon /> : <MenuIcon />}
                            variant="contained"
                            sx={{
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
            </AppBar>

            {/* MOBILE/TABLET VIEW NAVIGATION LINKS */}

            <Drawer
                anchor="right"
                open={menuOpen}
                onClose={closeMenu}
                PaperProps={{
                    id: "mobile-navigation",

                    sx: {
                        width: {
                            xs: "85%",
                            sm: 360,
                        },
                    },
                }}
            >
                <Box component="nav" aria-label="Mobile navigation">
                    <Box
                        sx={{
                            display: "flex",

                            alignItems: "center",

                            justifyContent: "space-between",

                            p: 2,

                            borderBottom: "1px solid",

                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="h3" component="p">
                            Menu
                        </Typography>

                        <IconButton onClick={closeMenu} aria-label="Close navigation menu">
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <List>
                        {navigation.map((item) => {
                            const active = location.pathname === item.path;

                            return (
                                <ListItem key={item.path} disablePadding>
                                    <ListItemButton
                                        component={RouterLink}
                                        to={item.path}
                                        onClick={closeMenu}
                                        selected={active}
                                        aria-current={active ? "page" : undefined}
                                        sx={{
                                            minHeight: 56,

                                            px: 3,

                                            "&.Mui-selected": {
                                                backgroundColor: "rgba(31, 112, 177, 0.12)",

                                                borderLeft: "5px solid",

                                                borderColor: "primary.main",
                                            },

                                            "&.Mui-selected:hover": {
                                                backgroundColor: "rgba(31, 112, 177, 0.18)",
                                            },
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{
                                                fontSize: "1.125rem",

                                                fontWeight: active ? 700 : 500,
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default Header;
