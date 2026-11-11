import React, { useState, useRef } from "react";
import { Container, Typography, Box, Paper, TextField, Stack, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Button, FormHelperText, Alert, } from "@mui/material";
//import { apiRequest } from "../mocks/APIClient";
function Advocate() {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interests: [],
        message: "",
    });

    const [errors, setErrors] = useState({});

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const messageRef = useRef(null);

    const validateForm = () => {
        const newErrors = {};

        if(formData.firstName.trim() === "") {
            newErrors.firstName = "First Name is required.";
        }

        if(formData.lastName.trim() === "") {
            newErrors.lastName = "Last Name is required.";
        }

        if(formData.email.trim() === "") {
            newErrors.email = "Email Address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Enter a valid email address.";
        }

        if(formData.interests.length === 0) {
            newErrors.interests = "Select at least one advocacy interest.";
        }

        if(formData.message.trim() === "") {
            newErrors.message = "Tell us about your interest is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    
    };
  
  /*
  API is throwing a 405 error commented out the code
  try {
            await apiRequest("/v1/advocate-inquiries", "POST", {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || null,
                interests: formData.interests,
                message: formData.message.trim(),
            });

            setIsSubmitted(true);
        } catch (err) {
            const apiError = err?.response?.data?.error;

            if (apiError?.fields) {
                setErrors((previousErrors) => ({ ...previousErrors, ...apiError.fields }));
            } else {
                setSubmitError(
                    "We could not submit your advocate interest request. Please try again."
                );
            }

            setIsSubmitted(false);
        } finally {
            setIsSubmitting(false);
        }
    };
  */

    const handleSubmit = (event) => {
        event.preventDefault();

        setHasAttemptedSubmit(true);

        const isValid = validateForm();

        if(isValid) {
            setIsSubmitted(true);
        } else {
            setIsSubmitted(false);

            if (formData.firstName.trim() === "") {
                firstNameRef.current?.focus();
            } else if (formData.lastName.trim() === "") {
                lastNameRef.current?.focus();
            } else if (
                formData.email.trim() === "" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
            ) {
                emailRef.current?.focus();
            } else if (formData.interests.length === 0) {
                document.getElementById("advocacy-interest-first")?.focus();
            } else if (formData.message.trim() === "") {
                messageRef.current?.focus();
            }
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: "",
        }));

        setIsSubmitted(false);
    };

    const handleInterestChange = (event) => {
        const { name, checked } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            interests: checked
            ? [...previousData.interests, name]
            : previousData.interests.filter((interest) => interest !== name),
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            interests: "",
        }));

        setIsSubmitted(false);
    };

    return(
        <Container maxWidth="md">
            <Box sx={{ py: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Become a TechSmart Advocate
                </Typography>

                <Typography variant="h6" component="p" gutterBottom>
                    Help us spread the word about technology education for older adults.
                </Typography>

                <Typography variant="body1" paragraph>
                    TechSmart Advocates help raise awareness about our programs and
                    connect older adults, families, and community organizations with 
                    technology-learning opportunities.
                </Typography>

                <Typography variant="body1" paragraph>
                    Interested in getting involved? Tell us a little about yourself
                    and how you would like to help.
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Submitting an interest request does not automatically make you 
                    an official TechSmart Advocate.
                </Typography>

                <Paper 
                    elevation={2}
                    sx={{
                        p: { xs: 2, sm: 4 },
                        mt: 4, 
                        borderRadius: 2,
                    }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Advocate Interest Form
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Fields marked with * are required.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate>

                            {hasAttemptedSubmit && Object.values(errors).some(Boolean) && (
                                <Alert severity="error" role="alert" sx={{ mb: 3 }}>
                                    Please correct the highlighted fields before submitting.
                                </Alert>
                            )}
                            <Stack spacing={3}>
                                <TextField 
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={Boolean(errors.firstName)}
                                    helperText={errors.firstName}
                                    inputRef={firstNameRef}
                                    required
                                    fullWidth
                                />

                                <TextField 
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={Boolean(errors.lastName)}
                                    helperText={errors.lastName}
                                    inputRef={lastNameRef}
                                    required
                                    fullWidth
                                />

                                <TextField 
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    inputRef={emailRef}
                                    required
                                    fullWidth
                                />

                                <TextField 
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                <FormControl 
                                    component="fieldset" 
                                    required
                                    error={Boolean(errors.interests)}
                                    aria-describedby="advocacy-interests-error"
                                >
                                    <FormLabel component="legend">
                                        Advocacy Interests
                                    </FormLabel>

                                    <FormGroup>
                                        <FormControlLabel 
                                            control={<Checkbox 
                                                id="advocacy-interest-first"
                                                name="sharePrograms"
                                                checked={formData.interests.includes("sharePrograms")}
                                                onChange={handleInterestChange}
                                                inputProps={{
                                                    "aria-invalid": Boolean(errors.interests),
                                                    "aria-describedby": errors.interests
                                                        ? "advocacy-interests-error"
                                                        : undefined,
                                                }}
                                                />
                                            } 
                                            label="Share TSLS programs with my community"
                                        />

                                        <FormControlLabel 
                                            control={<Checkbox 
                                                name="promoteEvents"
                                                checked={formData.interests.includes("promoteEvents")}
                                                onChange={handleInterestChange}
                                                />
                                            } 
                                            label="Help promote workshops and events"
                                        />

                                        <FormControlLabel 
                                            control={<Checkbox name="connectOrganizations"
                                                checked={formData.interests.includes("connectOrganizations")}
                                                onChange={handleInterestChange} 
                                                />
                                            } 
                                            label="Connect TSLS with community organizations"
                                        />

                                        <FormControlLabel 
                                            control={<Checkbox name="outreach" 
                                            checked={formData.interests.includes("outreach")}
                                            onChange={handleInterestChange}
                                            />
                                        } 
                                            label="Help with outreach or awareness"
                                        />

                                        <FormControlLabel 
                                            control={<Checkbox name="other" 
                                            checked={formData.interests.includes("other")}
                                            onChange={handleInterestChange}
                                            />
                                        } 
                                            label="Other"
                                        />
                                    </FormGroup>

                                    {errors.interests && (
                                        <FormHelperText id="advocacy-interests-error">
                                            {errors.interests}
                                        </FormHelperText>
                                    )}
                                </FormControl>

                                <TextField 
                                    label="Tell Us About Your Interest"
                                    name="message"
                                    multiline
                                    value={formData.message}
                                    onChange={handleChange}
                                    error={Boolean(errors.message)}
                                    helperText={errors.message}
                                    inputRef={messageRef}
                                    rows={4}
                                    required
                                    fullWidth
                                />
                                <Typography variant="body2" color="text.secondary">
                                    This form is for demonstration purposes only. Information entered 
                                    here will not be submitted to a production system.
                                </Typography>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    sx={{ alignSelf: "flex-start"  }}>
                                        Submit Advocate Request
                                </Button>
                            </Stack>
                        </Box>

                        {isSubmitted && (
                            <Alert severity="success" role="status" sx={{ mt: 3 }}>
                                Thank you for your interest in supporting TechSmart!
                                Your advocate request has been received in this demonstration.
                                No information was sent to a production system.
                                A TechSmart team member would normally follow up with you
                                about available opportunities.
                            </Alert>
                        )}
                    </Paper>
            </Box>
        </Container>
    );
}

export default Advocate;