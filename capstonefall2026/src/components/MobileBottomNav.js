import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import HelpIcon from "@mui/icons-material/Help";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

function MobileBottomNav() {
    const location = useLocation();

    return (
        <Box
            component="nav"
            aria-label="Mobile quick navigation"
            sx={{
                display: { xs: "block", md: "none" },
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
            }}
            >
            <BottomNavigation
            showLabels
            value={location.pathname}
            sx={{
                height: 80,
                paddingTop: 1,

                "& .MuiBottomNavigationAction-root:focus-visible": {
                    outline: "3px solid #173657",
                    outlineOffset:"-4px",
                    borderRadius: "8px",
                }
            }}>
                <BottomNavigationAction 
                    label="Home"
                    value="/"
                    icon={<HomeIcon />}
                    component={RouterLink}
                    to="/"
                    disableRipple
                />

                <BottomNavigationAction 
                    label="Get Help"
                    value="/need-help"
                    icon={<HelpIcon />}
                    component={RouterLink}
                    to="/need-help"
                    disableRipple
                />

                <BottomNavigationAction 
                    label="Give Help"
                    value="/want-to-help"
                    icon={<VolunteerActivismIcon />}
                    component={RouterLink}
                    to="/want-to-help"
                    disableRipple
                />
            </BottomNavigation>
        </Box>
    );
}

export default MobileBottomNav;