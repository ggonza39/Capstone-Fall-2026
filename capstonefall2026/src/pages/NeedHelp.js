import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

/* Workshop search/detail/registration integration boundary (PBI-12):
 * this page calls the workshopService adapter, which talks to the
 * sandbox/MSW /api/workshops* endpoints documented in
 * documentation/api-contract.md and mocks/README.md.
 */
import { getWorkshopById, getWorkshopsByZip, registerForWorkshop } from "../services/workshopService";

const EMPTY_REGISTRATION_FORM = { firstName: "", lastName: "", email: "", phone: "" };

/**
 * PBI-8 workshop details and registration journey
 * 
 * Workshop Detail Page View: Display the available information for the selected workshop, 
 * including applicable details such as workshop title, date/time, location, description, 
 * and other information provided by the workshop data source. The page must provide a clear
 * path to registration.
 * 
 * PBI-12: the "Register for Workshop" action opens a sandbox/mock registration dialog.
 * It fetches full workshop details via GET /api/workshops/:id and submits the
 * registration demonstration via POST /api/workshops/:id/registrations. This is a
 * Phase 1 sandbox demonstration only and is not the final production registration workflow.
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

    // Registration dialog state (PBI-12 sandbox registration journey). null = dialog closed.
    const [registration, setRegistration] = useState(null);

    const openRegistrationDialog = async (workshopSummary) => {
        setRegistration({
            workshopId: workshopSummary.id,
            workshopTitle: workshopSummary.title,
            status: "loading",
            detail: null,
            formValues: EMPTY_REGISTRATION_FORM,
            fieldErrors: {},
            submitError: "",
            result: null,
        });

        try {
            const detail = await getWorkshopById(workshopSummary.id);

            setRegistration((prev) =>
                prev && prev.workshopId === workshopSummary.id
                    ? { ...prev, detail, status: detail.seatAvailability > 0 ? "ready" : "full" }
                    : prev
            );
        } catch (err) {
            setRegistration((prev) =>
                prev && prev.workshopId === workshopSummary.id ? { ...prev, status: "detail-error" } : prev
            );
        }
    };

    const closeRegistrationDialog = () => setRegistration(null);

    const handleRegistrationFieldChange = (field) => (event) => {
        const { value } = event.target;

        setRegistration((prev) =>
            prev
                ? {
                    ...prev,
                    formValues: { ...prev.formValues, [field]: value },
                    fieldErrors: { ...prev.fieldErrors, [field]: undefined },
                }
                : prev
        );
    };

    const handleRegistrationSubmit = async (event) => {
        event.preventDefault();

        if (!registration) {
            return;
        }

        const { formValues } = registration;
        const fieldErrors = {};

        if (!formValues.firstName.trim()) {
            fieldErrors.firstName = "First name is required.";
        }

        if (!formValues.lastName.trim()) {
            fieldErrors.lastName = "Last name is required.";
        }

        if (!formValues.email.trim() && !formValues.phone.trim()) {
            fieldErrors.email = "Provide an email address or phone number.";
        }

        if (Object.keys(fieldErrors).length > 0) {
            setRegistration((prev) => (prev ? { ...prev, fieldErrors } : prev));
            return;
        }

        setRegistration((prev) => (prev ? { ...prev, status: "submitting", submitError: "" } : prev));

        try {
            const result = await registerForWorkshop(registration.workshopId, {
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                email: formValues.email || null,
                phone: formValues.phone || null,
            });

            setRegistration((prev) => (prev ? { ...prev, status: "success", result } : prev));
        } catch (err) {
            const apiError = err?.response?.data?.error;

            if (apiError?.code === "WORKSHOP_FULL") {
                setRegistration((prev) => (prev ? { ...prev, status: "full" } : prev));
            } else if (apiError?.code === "NOT_FOUND") {
                setRegistration((prev) => (prev ? { ...prev, status: "detail-error" } : prev));
            } else if (apiError?.fields) {
                setRegistration((prev) =>
                    prev ? { ...prev, status: "ready", fieldErrors: apiError.fields } : prev
                );
            } else {
                setRegistration((prev) =>
                    prev
                        ? {
                            ...prev,
                            status: "ready",
                            submitError: "We could not submit your sandbox registration. Please try again.",
                        }
                        : prev
                );
            }
        }
    };

    // Handle the search form submission
    const handleSearch = async (event) => {
        event.preventDefault();

        if (!/^\d{5}$/.test(zipCode)) {
            setError(true);
            setSearched(false);
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

                    {loading && (
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 3 }} role="status">
                            <CircularProgress size={24} />

                            <Typography>Searching for workshops near {zipCode}...</Typography>
                        </Stack>
                    )}

                    {/* Sample Data Search Results */}

                    {(searched || searchError) && (
                        <Box
                            component="section"
                            aria-labelledby="results-heading"
                            sx={{
                                mt: 6,
                            }}
                        >
                            {searchError && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {searchError}
                                </Alert>
                            )}

                            {searched && (
                                <>
                                    <Typography id="results-heading" variant="h2" component="h2" gutterBottom>
                                        Workshops Near {zipCode}
                                    </Typography>

                                    <Alert
                                        severity="info"
                                        sx={{
                                            mb: 3,
                                        }}
                                    >
                                        These are sample workshop results for frontend testing.
                                    </Alert>

                                    {!searchError && workshops.length === 0 && (
                                        <Alert severity="info" sx={{ mt: 3 }}>
                                            No workshops were found near {zipCode}. Try a different ZIP code or check back
                                            later.
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

                                                        <Button
                                                            variant="contained"
                                                            onClick={() => openRegistrationDialog(workshop)}
                                                        >
                                                            Register for Workshop
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>

            {/* Sandbox Registration Dialog (PBI-8 / PBI-12) */}
            <Dialog
                open={Boolean(registration)}
                onClose={closeRegistrationDialog}
                aria-labelledby="registration-dialog-title"
                fullWidth
                maxWidth="sm"
            >
                {registration && (
                    <>
                        <DialogTitle id="registration-dialog-title">
                            Register for {registration.workshopTitle}
                        </DialogTitle>

                        <DialogContent>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                This is a sandbox registration demonstration for Milestone 2. It does not submit a
                                final production workshop registration.
                            </Alert>

                            {registration.status === "loading" && (
                                <Stack direction="row" spacing={2} alignItems="center" role="status">
                                    <CircularProgress size={24} />

                                    <Typography>Loading workshop details...</Typography>
                                </Stack>
                            )}

                            {registration.status === "detail-error" && (
                                <Alert severity="error">
                                    We could not load this workshop. It may no longer be available. Please close
                                    this window and try another workshop.
                                </Alert>
                            )}

                            {registration.status === "full" && (
                                <Alert severity="warning">
                                    This workshop is full. Please choose another workshop or check back later.
                                </Alert>
                            )}

                            {registration.detail && (registration.status === "ready" || registration.status === "submitting") && (
                                <Box component="form" onSubmit={handleRegistrationSubmit} noValidate>
                                    <Stack spacing={2} sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {registration.detail.location} &middot; Room {registration.detail.roomNumber}
                                            <br />
                                            Seats available: {registration.detail.seatAvailability}
                                        </Typography>
                                    </Stack>

                                    {registration.submitError && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {registration.submitError}
                                        </Alert>
                                    )}

                                    <Stack spacing={2}>
                                        <TextField
                                            label="First Name"
                                            value={registration.formValues.firstName}
                                            onChange={handleRegistrationFieldChange("firstName")}
                                            error={Boolean(registration.fieldErrors.firstName)}
                                            helperText={registration.fieldErrors.firstName || " "}
                                            required
                                        />

                                        <TextField
                                            label="Last Name"
                                            value={registration.formValues.lastName}
                                            onChange={handleRegistrationFieldChange("lastName")}
                                            error={Boolean(registration.fieldErrors.lastName)}
                                            helperText={registration.fieldErrors.lastName || " "}
                                            required
                                        />

                                        <TextField
                                            label="Email"
                                            type="email"
                                            value={registration.formValues.email}
                                            onChange={handleRegistrationFieldChange("email")}
                                            error={Boolean(registration.fieldErrors.email)}
                                            helperText={registration.fieldErrors.email || "Provide an email or phone number."}
                                        />

                                        <TextField
                                            label="Phone"
                                            value={registration.formValues.phone}
                                            onChange={handleRegistrationFieldChange("phone")}
                                        />
                                    </Stack>
                                </Box>
                            )}

                            {registration.status === "success" && registration.result && (
                                <Alert severity="success">
                                    {registration.result.message}
                                    <br />
                                    Confirmation: {registration.result.registrationId} for{" "}
                                    {registration.result.workshop.title}.
                                </Alert>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={closeRegistrationDialog}>
                                {registration.status === "success" ? "Close" : "Cancel"}
                            </Button>

                            {(registration.status === "ready" || registration.status === "submitting") && (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={registration.status === "submitting"}
                                    onClick={handleRegistrationSubmit}
                                >
                                    {registration.status === "submitting" ? "Submitting..." : "Submit Registration"}
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
}

export default NeedHelp;
