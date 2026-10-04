import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import { getWorkshopById } from "../services/workshopService";

function WorkshopDetail() {
    const { id } = useParams();

    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showRegistration, setShowRegistration] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [formErrors, setFormErrors] = useState({
        name:"",
        email:"",
    })

    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const nameInputRef = useRef(null);
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

    const handleRegistrationSubmit = (event) => {
        event.preventDefault();

        const errors = {
            name: "",
            email: "",
        };

        if (!formData.name.trim()) {
            errors.name = "Please enter your full name.";
        }

        if (!formData.email.trim()) {
            errors.email = "Please enter your email address.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }

        setFormErrors(errors);

        if (errors.name || errors.email) {
            if (errors.name) {
                nameInputRef.current?.focus();
            } else if (errors.email) {
                emailInputRef.current?.focus();
            }

            return;
        }

        // Successful sandbox submission will go here next.
        setRegistrationSuccess(true);

        setTimeout(() => {
            confirmationRef.current?.focus();
        }, 0);
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

    if (error) {
        return (
            <Container sx={{ py: 6 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!workshop) {
        return null;
    }

    const workshopDate = new Date(workshop.dateTime);

    return (
        <Container component="main" maxWidth="md" sx={{ py: 6 }}>
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

                {workshop.seatAvailability > 0 ? (
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => setShowRegistration(true)}
                    >
                        Register for This Workshop
                    </Button>
                ) : (
                    <Alert severity="info">
                        This workshop currently has no seats available.
                    </Alert>
                )}

                {showRegistration && workshop.seatAvailability > 0 && (
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

                        <Stack spacing={3}>
                            <TextField
                                id="registration-name"
                                label="Full Name"
                                required
                                fullWidth
                                inputRef={nameInputRef}
                                error={Boolean(formErrors.name)}
                                helperText={formErrors.name}
                                value={formData.name}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        name: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="registration-email"
                                label="Email Address"
                                type="email"
                                required
                                fullWidth
                                inputRef={emailInputRef}
                                error={Boolean(formErrors.email)}
                                helperText={formErrors.email}
                                value={formData.email}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        email: event.target.value,
                                    })
                                }
                            />

                            <TextField
                                id="registration-phone"
                                label="Phone Number (Optional)"
                                type="tel"
                                fullWidth
                                value={formData.phone}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        phone: event.target.value,
                                    })
                                }
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                            >
                                Submit Registration
                            </Button>
                        </Stack>
                    </Box>
                )}

                {registrationSuccess && (
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
                            This was a sandbox demonstration only. No production workshop
                            registration was created.
                        </Typography>
                    </Alert>
                )}
            </Stack>
        </Container>
    );
}

export default WorkshopDetail;