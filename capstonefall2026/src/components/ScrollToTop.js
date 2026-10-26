import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        document.getElementById("main-content")?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default ScrollToTop;