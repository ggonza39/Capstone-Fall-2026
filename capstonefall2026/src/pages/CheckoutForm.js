import { useRef, useState } from 'react';
import {
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, Container, Stack, Typography, TextField } from "@mui/material";

function getDonorFieldError(name, value) {
  const trimmedValue = value.trim();
  const requiredMessages = {
    firstName: 'Please enter your first name.',
    lastName: 'Please enter your last name.',
    email: 'Please enter your email address.',
  };

  if (!trimmedValue) return requiredMessages[name];
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

// This was developed using ChatGPT (entered prompt given by Stripe website)
export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [donor, setDonor] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const firstNameInputRef = useRef(null);
  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const validateDonorFields = () => {
    const errors = {
      firstName: getDonorFieldError('firstName', donor.firstName),
      lastName: getDonorFieldError('lastName', donor.lastName),
      email: getDonorFieldError('email', donor.email),
    };
    setFormErrors(errors);

    const firstInvalidField = Object.keys(errors).find((name) => errors[name]);
    if (firstInvalidField) {
      const inputRefs = {
        firstName: firstNameInputRef,
        lastName: lastNameInputRef,
        email: emailInputRef,
      };
      inputRefs[firstInvalidField].current?.focus();
      return false;
    }

    return true;
  };

  const handleDonorFieldChange = (event) => {
    const { name, value } = event.target;
    setDonor((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: prev[name] ? getDonorFieldError(name, value) : '',
    }));
  };

  const handleDonorFieldBlur = (event) => {
    const { name, value } = event.target;
    setFormErrors((prev) => ({
      ...prev,
      [name]: getDonorFieldError(name, value),
    }));
  };
    
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');
    if (!validateDonorFields()) return;
    if (!stripe || !elements || loading) return;

    setLoading(true);

    try {
      // Validate payment fields with Stripe.
      const { error: paymentError } = await elements.submit();
      if (paymentError) {
        setMessage(paymentError.message);
        return;
      }

      // Only send non-sensitive donation data.
      const response = await fetch('/api/v1/donor-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: donor.firstName.trim(),
          lastName: donor.lastName.trim(),
          email: donor.email.trim(),
          phone: '111-111-1111' // test phone number
        }),
      });

      if (!response.ok) {
        throw new Error('Donation simulation failed');
      }

      const result = await response.json();

      if (result.isSimulation && result.success) {
        setMessage(
          'Demo successful! No actual payment was processed.'
        );
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ChatGPT fix: cannot put a form inside of a Box with component=form
  // 10/24/2026: Replaced with div
  return (
    <Box
                sx={{
                    backgroundColor: "#F4F8FC",
                    py: { xs: 5, md: 7 },
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h1" component="h1" gutterBottom>
                        Make a Donation
                    </Typography>

                    <Box
                      role="note"
                      sx={{
                        backgroundColor: "#FFF3CD",
                        border: "1px solid #E6B800",
                        borderRadius: 2,
                        p: 2,
                        mb: 3,
                      }}
                    >
                      <Typography variant="body1">
                        <strong>Demostration Only:</strong> This donation form is for 
                        testing purposes. No actual payments will be processed, 
                        and no donations will be collected.
                      </Typography>
                    </Box>
                    
                    <form onSubmit={handleSubmit} noValidate>
                        <Box
                        component="div"
                        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                        autoComplete="off"
                        >
                            
                        <TextField
                            id="donor-first-name"
                            name="firstName"
                            label="First Name"
                            autoComplete="given-name"
                            variant="outlined"
                            value={donor.firstName}
                            onChange={handleDonorFieldChange}
                            onBlur={handleDonorFieldBlur}
                            inputRef={firstNameInputRef}
                            error={Boolean(formErrors.firstName)}
                            helperText={formErrors.firstName}
                            required={true}
                        />
                        <TextField
                        id="donor-last-name"
                        name="lastName"
                        label="Last Name"
                        autoComplete="family-name"
                        variant="outlined"
                        value={donor.lastName}
                        onChange={handleDonorFieldChange}
                        onBlur={handleDonorFieldBlur}
                        inputRef={lastNameInputRef}
                        error={Boolean(formErrors.lastName)}
                        helperText={formErrors.lastName}
                        required={true}
                        />

                        <TextField
                        id="donor-email"
                        name="email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        variant="outlined"
                        value={donor.email}
                        onChange={handleDonorFieldChange}
                        onBlur={handleDonorFieldBlur}
                        inputRef={emailInputRef}
                        error={Boolean(formErrors.email)}
                        helperText={formErrors.email}
                        required={true}
                        />
                        </Box>
                        <Stack spacing={2}>

                        {
                            // Apple Pay - requires legal compliance to use in non-profit websites.
                            // Change Apple Pay to 'always' only when TechSmart for Seniors is registered through the Apple Developer Program.
                            <ExpressCheckoutElement
                            options={{
                            paymentMethods: {
                                applePay: "never", 
                                googlePay: "never",
                                link: "never"
                            },
                            }}
                            onConfirm={(event) => {
                            // Demo only: no backend or PaymentIntent exists.
                            event.paymentFailed({
                                reason: "fail",
                                message: "Demo only—no payment was processed.",
                            });
                            }}
                        /> }

                        <PaymentElement />

                        <Button
                                variant="contained"
                                size="large"
                                type="submit"
                                fullWidth
                                disabled={!stripe || !elements || loading}
                            >
                                {loading ? 'Processing...' : 'Donate'}
                            </Button>
                        </Stack>

                        {message && <p role="status">{message}</p>}
                       
                        </form>

                </Container>
            </Box>
  );
}
