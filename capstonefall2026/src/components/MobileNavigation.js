import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";
import PageTheme from "../theme/PageTheme";

function MobileNavigation({ open, onClose, navigation, pathname, reloadDocument = false }) {
    return (
        <PageTheme>
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                id: "mobile-navigation-paper",
                sx: {
                    width: {
                        xs: "85%",
                        sm: 360,
                    },
                },
            }}
        >
            <Box component="nav" id="mobile-navigation" aria-label="Mobile navigation">
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

                    <IconButton onClick={onClose} aria-label="Close navigation menu">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List>
                    {navigation.map((item) => {
                        const active = pathname === item.path;

                        return (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    component={RouterLink}
                                    to={item.path}
                                    reloadDocument={reloadDocument}
                                    onClick={onClose}
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
        </PageTheme>
    );
}

export default MobileNavigation;
