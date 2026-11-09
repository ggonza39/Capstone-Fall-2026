import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Container,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { getWorkshopById, registerForWorkshop } from "../services/workshopService";
import { applyPageMetadata, getRouteMetadata } from "../seo/metadata";

const EMPTY_REGISTRATION_FORM = { firstName: "", lastName: "", email: "", phone: "" };

function WorkshopDetail() {
    const { id } = useParams();

    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showRegistration, setShowRegistration] = useState(false);
    const [workshopFull, setWorkshopFull] = useState(false);

    const [formData, setFormData] = useState(EMPTY_REGISTRATION_FORM);

    const [formErrors, setFormErrors] = useState({});

    // Duplicate-submission prevention: "submitting" disables the submit button
    // until the sandbox API responds (see documentation/api-contract.md, API —
    // Workshop Registration).
    const [registrationStatus, setRegistrationStatus] = useState("idle");
    const [submitError, setSubmitError] = useState("");
    const [registrationResult, setRegistrationResult] = useState(null);

    const firstNameInputRef = useRef(null);
    const lastNameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const confirmationRef = useRef(null);
    

    useEffect(() => {
        async function loadWorkshop() {
            try {
                setLoading(true);
                setError("");

                const data = await getWorkshopById(id);
                setWorkshop(data);
            } catch (err) {
                setError("We could not find this workshop. Please return to the workshop search.");
            } finally {
                setLoading(false);
            }
        }

        loadWorkshop();
    }, [id]);

    useEffect(() => {
        if (loading || (!error && workshop && workshop.id !== id)) {
            return;
        }

        const metadata = getRouteMetadata(`/workshops/${encodeURIComponent(id)}`);
        applyPageMetadata(error || !workshop ? {
            ...metadata,
            title: "Workshop Not Found | TechSmart",
            description: "This workshop could not be found. Return to technology workshop search.",
            canonical: null,
            robots: "noindex,follow",
        } : {
            ...metadata,
            title: `${workshop.title} | TechSmart`,
            description: `Details for ${workshop.title}, including location, accessibility information, and registration options.`,
        });
    }, [id, workshop, error, loading]);

    const handleRegistrationFieldChange = (field) => (event) => {
        const { value } = event.target;

        setFormData((prev) => ({ ...prev, [field]: value }));
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleRegistrationSubmit = async (event) => {
        event.preventDefault();

        // Duplicate-submission prevention: ignore repeated clicks/Enter while
        // a request is already in flight.
        if (registrationStatus === "submitting") {
            return;
        }

        const errors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = "Please enter your first name.";
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Please enter your last name.";
        }

        if (!formData.email.trim() && !formData.phone.trim()) {
            errors.email = "Please provide an email address or phone number.";
        } else if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);

            if (errors.firstName) {
                firstNameInputRef.current?.focus();
            } else if (errors.lastName) {
                lastNameInputRef.current?.focus();
            } else if (errors.email) {
                emailInputRef.current?.focus();
            }

            return;
        }

        setFormErrors({});
        setSubmitError("");
        setRegistrationStatus("submitting");

        try {
            const result = await registerForWorkshop(id, {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim() || null,
                phone: formData.phone.trim() || null,
            });

            setRegistrationResult(result);
            setRegistrationStatus("success");

            setTimeout(() => {
                confirmationRef.current?.focus();
            }, 0);
        } catch (err) {
            const apiError = err?.response?.data?.error;

            setRegistrationStatus("idle");

            if (apiError?.code === "WORKSHOP_FULL") {
                setWorkshopFull(true);
                setShowRegistration(false);
            } else if (apiError?.code === "NOT_FOUND") {
                setError("We could not find this workshop. Please return to the workshop search.");
                setShowRegistration(false);
            } else if (apiError?.fields) {
                setFormErrors(apiError.fields);
            } else {
                setSubmitError("We could not submit your sandbox registration. Please try again.");
            }
        }
    };

    if (loading) {
        return (
            <Container sx={{ py: 6 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "300px",
                    }}
                >
                    <CircularProgress aria-label="Loading workshop details" />
                </Box>
            </Container>
        );
    }

    if (error || !workshop) {
        return (
            <Container sx={{ py: 6 }}>
                <Typography component="h1" variant="h2" gutterBottom>Workshop Not Found</Typography>
                <Alert severity="error">
                    {error || "We could not find this workshop. Please return to the workshop search."}
                </Alert>
                <Button component={RouterLink} to="/need-help" variant="outlined" sx={{ mt: 3 }}>
                    Find Workshops
                </Button>
            </Container>
        );
    }

    const workshopDate = new Date(workshop.dateTime);

    return (
        <Container component="article" maxWidth="md" sx={{ py: 6 }}>
            <Typography component="h1" variant="h3" gutterBottom>
                {workshop.title}
            </Typography>

            <Stack spacing={3}>
                <Box>
                    <Typography component="h2" variant="h5" gutterBottom>
                        Workshop Information
                    </Typography>

                    <Typography>
                        <strong>Date:</strong>{" "}
                        {workshopDate.toLocaleDateString()}
                    </Typography>

                    <Typography>
                        <strong>Time:</strong>{" "}
                        {workshopDate.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                        })}
                    </Typography>

                    <Typography>
                        <strong>Location:</strong> {workshop.location}
                    </Typography>

                    <Typography>
                        <strong>Room:</strong> {workshop.roomNumber}
                    </Typography>

                    <Typography>
                        <strong>Instructor:</strong> {workshop.instructorName}
                    </Typography>

                    <Typography>
                        <strong>Seats Available:</strong> {workshop.seatAvailability}
                    </Typography>
                </Box>

                <Box>
                    <Typography component="h2" variant="h5" gutterBottom>
                        Accessibility Features
                    </Typography>

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {workshop.accessibilityFeatures.map((feature) => (
                            <Chip key={feature} label={feature} />
                        ))}
                    </Stack>
                </Box>

                {workshopFull || workshop.seatAvailability <= 0 ? (
                    <Alert severity="info">
                        This workshop is full. Please choose another workshop or check back later.
                    </Alert>
                ) : registrationStatus !== "success" && !showRegistration ? (
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => setShowRegistration(true)}
                    >
                        Register for This Workshop
                    </Button>
                ) : null}

                {showRegistration && registrationStatus !== "success" && !workshopFull && workshop.seatAvailability > 0 && (
                    <Box
                        component="form"
                        aria-labelledby="registration-heading"
                        onSubmit={handleRegistrationSubmit}
                        noValidate
                        sx={{ mt: 4 }}
                    >
                        <Typography
                            id="registration-heading"
                            component="h2"
                            variant="h5"
                            gutterBottom
                        >
                            Workshop Registration
                        </Typography>

                        <Alert severity="info" sx={{ mb: 3 }}>
                            This is a demonstration registration form. Submitting this form
                            does not create a production workshop registration.
                        </Alert>

                        {submitError && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {submitError}
                            </Alert>
                        )}

                        <Stack spacing={3}>
                            <TextField
                                id="registration-first-name"
                                label="First Name"
                                required
                                fullWidth
                                inputRef={firstNameInputRef}
                                error={Boolean(formErrors.firstName)}
                                helperText={formErrors.firstName}
                                value={formData.firstName}
                                onChange={handleRegistrationFieldChange("firstName")}
                            />

                            <TextField
                                id="registration-last-name"
                                label="Last Name"
                                required
                                fullWidth
                                inputRef={lastNameInputRef}
                                error={Boolean(formErrors.lastName)}
                                helperText={formErrors.lastName}
                                value={formData.lastName}
                                onChange={handleRegistrationFieldChange("lastName")}
                            />

                            <TextField
                                id="registration-email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                inputRef={emailInputRef}
                                error={Boolean(formErrors.email)}
                                helperText={formErrors.email || "Provide an email address or phone number."}
                                value={formData.email}
                                onChange={handleRegistrationFieldChange("email")}
                            />

                            <TextField
                                id="registration-phone"
                                label="Phone Number (Optional)"
                                type="tel"
                                fullWidth
                                value={formData.phone}
                                onChange={handleRegistrationFieldChange("phone")}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={registrationStatus === "submitting"}
                            >
                                {registrationStatus === "submitting" ? "Submitting..." : "Submit Registration"}
                            </Button>
                        </Stack>
                    </Box>
                )}

                {registrationStatus === "success" && registrationResult && (
                    <Alert
                        severity="success"
                        tabIndex={-1}
                        ref={confirmationRef}
                        role="status"
                        sx={{ mt: 3 }}
                    >
                        <Typography variant="h6" component="h2">
                            Registration Demo Complete
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            Your demonstration registration for <strong>{workshop.title}</strong>{" "}
                            was submitted successfully.
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            Confirmation: {registrationResult.registrationId}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            This was a sandbox demonstration only. No production workshop
                            registration was created.
                        </Typography>
                        
                        <Typography sx={{ mt: 1 }}>
                            Next steps: No further action is required for this demonstration. To register for 
                            an actual workshop, please use the organization's official registration process 
                            when available.
                        </Typography>
                    </Alert>
                )}
            </Stack>
        </Container>
    );
}

export default WorkshopDetail;
