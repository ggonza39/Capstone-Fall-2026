import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, CardContent, Container, Grid, Stack, TextField, Typography } from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
/**
 * PBI-6 Implement dual-path landing and navigation.
 *
 * Dual-Path Hero Section: Construct a hero layout featuring two large, 
 * distinct calls to action labeled “I Need Help” and “I Want to Help,” 
 * using accessible, high-contrast controls that provide direct entry 
 * into their respective user journeys.
 * 
 */
function Home() {
    const navigate = useNavigate();

    const [zipCode, setZipCode] = useState("");
    const [zipError, setZipError] = useState(false);

    //Validate the zip code and navigate to the need-help page with the zip code
    const handleWorkshopSearch = (event) => {
        event.preventDefault();

        const validZip = /^\d{5}$/.test(zipCode);

        if (!validZip) {
            setZipError(true);
            return;
        }

        setZipError(false);

        navigate(`/need-help?zip=${zipCode}`);
    };

    return (
        <>
            {/* Hero Section */}

            <Box
                component="section"
                sx={{
                    backgroundColor: "#F4F8FC",

                    py: {
                        xs: 6,
                        md: 10,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Stack
                        spacing={3}
                        alignItems="flex-start"
                        sx={{
                            maxWidth: 760,
                        }}
                    >
                        <Typography variant="h1" component="h1">
                            Technology Made Simple.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: {
                                    xs: "1.125rem",
                                    md: "1.25rem",
                                },

                                maxWidth: "60ch",
                            }}
                        >
                            TechSmart Learning for Seniors is a non-profit organization committed to teaching older
                            adults the latest tools and technology to help them lead active lives.
                        </Typography>

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<HelpOutlineIcon />}
                                onClick={() => navigate("/need-help")}
                            >
                                I Need Help
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                startIcon={<VolunteerActivismIcon />}
                                onClick={() => navigate("/want-to-help")}
                            >
                                I Want to Help
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* How Can We Help? Section */}

            <Box
                component="section"
                aria-labelledby="help-heading"
                sx={{
                    py: {
                        xs: 6,
                        md: 8,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Typography id="help-heading" variant="h2" component="h2" textAlign="center" gutterBottom>
                        How Can We Help?
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Workshop Card */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <SchoolIcon
                                        color="primary"
                                        sx={{
                                            fontSize: 48,
                                            mb: 2,
                                        }}
                                    />

                                    <Typography variant="h3" component="h3" gutterBottom>
                                        Find a Workshop
                                    </Typography>

                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        Find technology workshops and learning opportunities near you.
                                    </Typography>

                                    <Button variant="contained" onClick={() => navigate("/need-help")}>
                                        Find Workshops
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Resources Card */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <MenuBookIcon
                                        color="primary"
                                        sx={{
                                            fontSize: 48,
                                            mb: 2,
                                        }}
                                    />

                                    <Typography variant="h3" component="h3" gutterBottom>
                                        Technology Resources
                                    </Typography>

                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        Explore simple technology guides and educational resources.
                                    </Typography>

                                    <Button variant="contained" onClick={() => navigate("/resources")}>
                                        View Resources
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Help Card */}

                        <Grid
                            size={{
                                xs: 12,
                                md: 4,
                            }}
                        >
                            <Card
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                }}
                            >
                                <CardContent>
                                    <HelpOutlineIcon
                                        color="primary"
                                        sx={{
                                            fontSize: 48,
                                            mb: 2,
                                        }}
                                    />

                                    <Typography variant="h3" component="h3" gutterBottom>
                                        Get Technology Help
                                    </Typography>

                                    <Typography variant="body1" sx={{ mb: 3 }}>
                                        Find support when you need help using everyday technology.
                                    </Typography>

                                    <Button variant="contained" onClick={() => navigate("/need-help")}>
                                        Get Help
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Zip Code Workshop Search Section */}

            <Box
                component="section"
                aria-labelledby="workshop-heading"
                sx={{
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",

                    py: {
                        xs: 6,
                        md: 8,
                    },
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        id="workshop-heading"
                        variant="h2"
                        component="h2"
                        textAlign="center"
                        gutterBottom
                        sx={{
                            color: "inherit",
                        }}
                    >
                        Find a Workshop Near You
                    </Typography>

                    <Typography
                        variant="body1"
                        textAlign="center"
                        sx={{
                            mb: 4,
                        }}
                    >
                        Enter your ZIP code to find technology workshops in your area.
                    </Typography>

                    <Box component="form" onSubmit={handleWorkshopSearch} noValidate>
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            alignItems="flex-start"
                        >
                            <TextField
                                id="home-zip-code"
                                label="ZIP Code"
                                value={zipCode}
                                onChange={(event) => {
                                    const value = event.target.value.replace(/\D/g, "");

                                    setZipCode(value.slice(0, 5));

                                    if (zipError) {
                                        setZipError(false);
                                    }
                                }}
                                error={zipError}
                                helperText={zipError ? "Enter a valid 5-digit ZIP code." : "Example: 30301"}
                                inputProps={{
                                    inputMode: "numeric",
                                    maxLength: 5,
                                }}
                                sx={{
                                    backgroundColor: "#FFFFFF",

                                    borderRadius: 1,

                                    flex: 1,

                                    "& .MuiFormHelperText-root": {
                                        backgroundColor: "primary.main",

                                        color: "#FFFFFF",

                                        margin: 0,

                                        paddingTop: 1,
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<LocationOnIcon />}
                                sx={{
                                    backgroundColor: "secondary.main",

                                    color: "secondary.contrastText",

                                    minHeight: 56,

                                    "&:hover": {
                                        backgroundColor: "secondary.dark",
                                    },
                                }}
                            >
                                Find Workshops
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            {/* Want to Help? Section */}

            <Box
                component="section"
                aria-labelledby="give-heading"
                sx={{
                    py: {
                        xs: 6,
                        md: 8,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Typography id="give-heading" variant="h2" component="h2" textAlign="center" gutterBottom>
                        Want to Make a Difference?
                    </Typography>

                    <Typography
                        variant="body1"
                        textAlign="center"
                        sx={{
                            maxWidth: 700,
                            mb: 4,
                        }}
                    >
                        Help TechSmart support older adults as they learn to use technology.
                    </Typography>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button variant="contained" onClick={() => navigate("/want-to-help#donate")}>
                            Donate
                        </Button>

                        <Button variant="outlined" onClick={() => navigate("/want-to-help#volunteer")}>
                            Volunteer
                        </Button>

                        <Button variant="outlined" onClick={() => navigate("/want-to-help#advocate")}>
                            Advocate
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default Home;
