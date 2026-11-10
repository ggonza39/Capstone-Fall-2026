import { useCallback, useEffect, useRef, useState } from "react";

import { Link as RouterLink, useLocation } from "react-router-dom";

import logo from "../assets/techsmartLogo.webp";
import logo260 from "../assets/optimized/techsmartLogo-260.webp";
import logo380 from "../assets/optimized/techsmartLogo-380.webp";
import { loadMobileNavigation } from "./mobileNavigationLoader";
import SiteIcon from "./SiteIcon";
import "./SiteShell.css";

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
            <header className="site-header">
                <div className="site-container">
                    <div className="site-header-toolbar">
                        <RouterLink
                            to="/"
                            onClick={closeMenu}
                            aria-label="TechSmart Learning for Seniors home"
                            className="site-logo-link"
                        >
                            <img
                                src={logo}
                                srcSet={`${logo260} 260w, ${logo380} 380w, ${logo} 500w`}
                                sizes="(min-width: 900px) 260px, (min-width: 600px) 220px, 190px"
                                alt="TechSmart Learning for Seniors"
                                width={500}
                                height={250}
                                loading="eager"
                                fetchPriority="high"
                                className="site-logo"
                            />
                        </RouterLink>

                        {/* DESKTOP VIEW NAVIGATION LINKS */}

                        <nav
                            aria-label="Main navigation"
                            className="site-desktop-navigation"
                        >
                            {navigation.map((item) => {
                                const active = location.pathname === item.path;

                                return (
                                    <RouterLink
                                        key={item.path}
                                        to={item.path}
                                        aria-current={active ? "page" : undefined}
                                        className="site-shell-button site-header-link"
                                    >
                                        {item.label}
                                    </RouterLink>
                                );
                            })}
                        </nav>

                        {/* MOBILE/TABLET MENU BUTTON */}

                        <button
                            type="button"
                            ref={menuButtonRef}
                            onClick={toggleMenu}
                            aria-label={menuLoading ? "Loading navigation menu" : menuOpen ? "Close navigation menu" : "Open navigation menu"}
                            aria-busy={menuLoading}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-navigation"
                            className="site-shell-button site-menu-button"
                        >
                            <span className="site-menu-icon">
                                {menuLoading ? (
                                    <span role="progressbar" aria-label="Loading navigation menu" className="site-menu-progress">
                                        <svg viewBox="22 22 44 44" aria-hidden="true" focusable="false">
                                            <circle cx="44" cy="44" r="20.2" fill="none" stroke="currentColor" strokeWidth="3.6" />
                                        </svg>
                                    </span>
                                ) : <SiteIcon name={menuOpen ? "close" : "menu"} />}
                            </span>
                            Menu
                        </button>
                    </div>
                </div>
                {menuError && (
                    <div
                        role="alert"
                        className="site-menu-error"
                    >
                        <p>{menuError}</p>
                        <button type="button" className="site-shell-button site-menu-recovery" onClick={openMenu}>Retry</button>
                        <button type="button" className="site-shell-button site-menu-recovery" onClick={() => {
                            closeMenu();
                            menuButtonRef.current?.focus();
                        }}>Dismiss</button>
                    </div>
                )}
            </header>

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
