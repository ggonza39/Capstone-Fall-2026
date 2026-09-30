import { useState } from "react";

import { Alert, Box, Button, Container, Stack, TextField, Typography } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

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
    };

    // Form validation function
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Enter your name.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Enter your email address.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Tell us how we can help.";
        }

        return newErrors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSubmitted(false);
            return;
        }

        // Successful submission
        setErrors({});
        setSubmitted(true);

        // Clear form fields
        setFormData({
            name: "",
            email: "",
            message: "",
        });

        // Mock submission only.
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

                {Object.keys(errors).length > 0 && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        Please correct the fields below.
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={3}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Name"
                            value={formData.name}
                            onChange={handleChange}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
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

                        <Button type="submit" variant="contained" size="large" startIcon={<SendIcon />}>
                            Send Message
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}

export default Contact;
