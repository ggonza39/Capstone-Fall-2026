import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
    const { pathname } = useLocation();
    const previousPathname = useRef(pathname);

    useEffect(() => {
        // Keep the browser's focus and scroll restoration on a document load.
        // Only client-side page navigation needs this focus/layout work.
        if (previousPathname.current === pathname) {
            return;
        }
        previousPathname.current = pathname;
        document.getElementById("main-content")?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default ScrollToTop;
