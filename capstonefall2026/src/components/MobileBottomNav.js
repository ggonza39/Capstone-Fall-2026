import { Link as RouterLink, useLocation } from "react-router-dom";
import SiteIcon from "./SiteIcon";

const quickNavigation = [
    { label: "Home", path: "/", icon: "home" },
    { label: "Get Help", path: "/need-help", icon: "help" },
    { label: "Give Help", path: "/want-to-help", icon: "volunteer" },
];

function MobileBottomNav() {
    const location = useLocation();

    return (
        <nav aria-label="Mobile quick navigation" className="site-bottom-navigation">
            <div className="site-bottom-navigation-content">
                {quickNavigation.map((item) => (
                    <RouterLink
                        key={item.path}
                        to={item.path}
                        aria-current={location.pathname === item.path ? "page" : undefined}
                        className="site-bottom-link"
                    >
                        <SiteIcon name={item.icon} />
                        <span>{item.label}</span>
                    </RouterLink>
                ))}
            </div>
        </nav>
    );
}

export default MobileBottomNav;
