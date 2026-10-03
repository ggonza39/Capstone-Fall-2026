import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Alert, Box, Button, Card, CardContent, Container, Grid, Stack, TextField, Typography } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

/*Temporary mock data for testing the workshop search results.
 * Go to workshopService.js to replace with real data from the backend.
 */
import { getWorkshopsByZip } from "../services/workshopService";

/**
 * PBI-8 workshop details and registration journey
 * 
 * Workshop Detail Page View: Display the available information for the selected workshop, 
 * including applicable details such as workshop title, date/time, location, description, 
 * and other information provided by the workshop data source. The page must provide a clear
 * path to registration.
 * 
 */
function NeedHelp() {
    const [searchParams] = useSearchParams();

    const startingZip = searchParams.get("zip") || "";

    const [zipCode, setZipCode] = useState(startingZip);

    const [error, setError] = useState(false);

    const [searched, setSearched] = useState(/^\d{5}$/.test(startingZip));

    const [workshops, setWorkshops] = useState([]);

    const [loading, setLoading] = useState(false);

    const [searchError, setSearchError] = useState("");

    // Handle the search form submission
    const handleSearch = async (event) => {
        event.preventDefault();

        if (!/^\d{5}$/.test(zipCode)) {
            setError(true);
            setSearched(false);
            setSearchError("");
            return;
        }

        setError(false);
        setSearchError("");
        setLoading(true);

        try {
            const response = await getWorkshopsByZip(zipCode);

            setWorkshops(response.workshops);
            setSearched(true);
        } catch (error) {
            setSearchError("We could not load workshops. Please try again.");

            setSearched(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#F4F8FC",

                    py: {
                        xs: 5,
                        md: 7,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h1" component="h1" gutterBottom>
                        I Need Help
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: "65ch",
                        }}
                    >
                        Find technology workshops and resources designed to help you feel more comfortable using
                        everyday technology.
                    </Typography>
                </Container>
            </Box>

            {/* Workshop Search */}

            <Box
                component="section"
                aria-labelledby="find-workshop-heading"
                sx={{
                    py: {
                        xs: 6,
                        md: 8,
                    },
                }}
            >
                <Container maxWidth="md">
                    <Typography id="find-workshop-heading" variant="h2" component="h2" gutterBottom>
                        Find a Workshop Near You
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 3,
                        }}
                    >
                        Enter your 5-digit ZIP code to search for nearby technology workshops.
                    </Typography>

                    <Box component="form" onSubmit={handleSearch} noValidate>
                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row",
                            }}
                            spacing={2}
                            alignItems="flex-start"
                        >
                            <TextField
                                id="workshop-zip"
                                label="ZIP Code"
                                value={zipCode}
                                onChange={(event) => {
                                    const value = event.target.value.replace(/\D/g, "");

                                    setZipCode(value.slice(0, 5));

                                    if (error) {
                                        setError(false);
                                    }
                                }}
                                error={error}
                                helperText={error ? "Enter a valid 5-digit ZIP code." : "Example: 30301"}
                                inputProps={{
                                    inputMode: "numeric",
                                    maxLength: 5,
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<SearchIcon />}
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </Stack>
                    </Box>

                    {searchError && (
                        <Alert severity="error" sx={{ mt: 3 }}>
                            {searchError}
                        </Alert>
                    )}

                    {/* Sample Data Search Results */}

                    {searched && (
                        <Box
                            component="section"
                            aria-labelledby="results-heading"
                            sx={{
                                mt: 6,
                            }}
                        >
                            <Typography id="results-heading" variant="h2" component="h2" gutterBottom>
                                Workshops Near {zipCode}
                            </Typography>

                            {workshops.length > 0 && ( 
                            <Alert
                                severity="info"
                                sx={{
                                    mb: 3,
                                }}
                            >
                                These are sample workshop results for frontend testing.
                            </Alert>
                            )}

                            

                            {workshops.length === 0 && (
                                <Alert severity="info" sx={{ mb: 3 }}>
                                    No workshops were found for this ZIP code. Please try another ZIP code.
                                </Alert>
                            )}

                            <Grid container spacing={3}>
                                {workshops.map((workshop) => (
                                    <Grid
                                        key={workshop.id}
                                        size={{
                                            xs: 12,
                                            md: 6,
                                        }}
                                    >
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                height: "100%",
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h3" component="h3" gutterBottom>
                                                    {workshop.title}
                                                </Typography>

                                                <Stack spacing={2} sx={{ mb: 3 }}>
                                                    {/* Location */}
                                                    <Stack direction="row" spacing={1} alignItems="flex-start">
                                                        <LocationOnIcon color="primary" aria-hidden="true" />

                                                        <Typography>{workshop.address}</Typography>
                                                    </Stack>

                                                    {/* Date */}
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <CalendarMonthIcon color="primary" aria-hidden="true" />

                                                        <Typography>{workshop.date}</Typography>
                                                    </Stack>

                                                    {/* Time */}
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <AccessTimeIcon color="primary" aria-hidden="true" />

                                                        <Typography>{workshop.time}</Typography>
                                                    </Stack>

                                                    {/* Event Type */}
                                                    <Typography>
                                                        <strong>Type:</strong> {workshop.eventType}
                                                    </Typography>

                                                    {/* Distance 
                                                    * Zip code is not set up to calculate distance yet
                                                    *
                                                    */}
                                                    {workshop.eventType !== "Virtual" && (
                                                        <Typography>
                                                            <strong>Distance:</strong> {workshop.distanceMiles} miles
                                                        </Typography>
                                                    )}
                                                </Stack>

                                                <Button variant="contained">Register for Workshop</Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
}

export default NeedHelp;
