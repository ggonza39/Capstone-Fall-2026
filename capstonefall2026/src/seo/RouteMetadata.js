import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyPageMetadata, getRouteMetadata } from "./metadata";

function RouteMetadata() {
    const { pathname } = useLocation();

    useEffect(() => {
        applyPageMetadata(getRouteMetadata(pathname));
    }, [pathname]);

    return null;
}

export default RouteMetadata;
