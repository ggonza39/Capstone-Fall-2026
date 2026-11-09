import { useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import { apiRequest } from "../mocks/APIClient";

/**
 * General Contact Inquiry (REQ-23). Submits through the shared apiRequest
 * client to POST /api/v1/contact-inquiries — see documentation/api-contract.md,
 * API 3 — General Contact Inquiry.
 */
const INQUIRY_TYPES = [
    "General Question",
    "Technical Support",
    "Partnership",
    "Workshop Information",
    "Other",
];

function Contact() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        inquiryType: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    // Duplicate-submission prevention: disables the submit button while the
    // sandbox request is in flight.
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));

        if (submitted) {
            setSubmitted(false);
        }

        setSubmitError("");
    };

    // Form validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Enter your first name.";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Enter your last name.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Enter your email address.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.inquiryType) {
            newErrors.inquiryType = "Select an inquiry type.";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Tell us how we can help.";
        }

        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Duplicate-submission prevention: ignore repeated clicks/Enter while
        // a request is already in flight.
        if (isSubmitting) {
            return;
        }

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitted(false);
            return;
        }

        setErrors({});
        setSubmitError("");
        setIsSubmitting(true);

        try {
            await apiRequest("/v1/contact-inquiries", "POST", {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                inquiryType: formData.inquiryType,
                message: formData.message.trim() || null,
            });

            setSubmitted(true);

            // Clear form fields
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                inquiryType: "",
                message: "",
            });
        } catch (err) {
            const apiError = err?.response?.data?.error;

            if (apiError?.fields) {
                setErrors(apiError.fields);
            } else {
                setSubmitError("We could not submit your message. Please try again.");
            }

            setSubmitted(false);
        } finally {
            setIsSubmitting(false);
        }

        // Sandbox submission only (see documentation/api-contract.md).
        // Production integration will use the approved contact workflow.
    };

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#F4F8FC",
                    py: { xs: 5, md: 7 },
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h1" component="h1" gutterBottom>
                        Contact Us
                    </Typography>

                    <Typography variant="body1" sx={{ maxWidth: "65ch" }}>
                        Have a question? Send us a message and let us know how we can help.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="sm" sx={{ py: { xs: 6, md: 8 } }}>
                <Typography variant="h2" component="h2" gutterBottom>
                    Send Us a Message
                </Typography>

                {submitted && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        Your message was submitted successfully.
                    </Alert>
                )}

                {submitError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {submitError}
                    </Alert>
                )}

                {Object.keys(errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Please correct the fields below.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            required
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName}
                        />

                        <TextField
                            required
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={Boolean(errors.lastName)}
                            helperText={errors.lastName}
                        />

                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                        />

                        <TextField
                            required
                            select
                            id="inquiryType"
                            name="inquiryType"
                            label="Inquiry Type"
                            value={formData.inquiryType}
                            onChange={handleChange}
                            error={Boolean(errors.inquiryType)}
                            helperText={errors.inquiryType}
                        >
                            {INQUIRY_TYPES.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            required
                            id="message"
                            name="message"
                            label="How can we help?"
                            multiline
                            minRows={5}
                            value={formData.message}
                            onChange={handleChange}
                            error={Boolean(errors.message)}
                            helperText={errors.message}
                        />

                        <Button
                            data-uniform-size="false"
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                        >
                            {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}

export default Contact;

