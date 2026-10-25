import { useState } from 'react';
import {
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, Container, Stack, Typography, TextField } from "@mui/material";

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
    
    // Reference for these useStates and validation methods: https://dev.to/anthonyzhang220/form-validation-with-material-ui-text-field-component-and-react-23dl
    // ChatGPT used to modify the validation methods
 const [valid, setValid] = useState({
    firstNameIsValid: true,
    lastNameIsValid: true,
    emailIsValid: true
 });
    
 const validateDonorFields = () => {
  const firstNameIsValid =
    /^[a-zA-Z\s'-]+$/.test(donor.firstName.trim());

  const lastNameIsValid =
    /^[a-zA-Z\s'-]+$/.test(donor.lastName.trim());

  const emailIsValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.email.trim());

  const validation = {
    firstNameIsValid,
    lastNameIsValid,
    emailIsValid
  };

  setValid(validation);

  return Object.values(validation).every(Boolean);
};

const handleDonorFieldChange = (e) => {
  const { name, value } = e.target;

  // Update donor information
  setDonor((prev) => ({
    ...prev,
    [name]: value
  }));

  // Define regex based on field
  let reg = /^[a-zA-Z\s'-]+$/;

  if (name === "email") {
    reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }

  // Update validation for the specific field
  setValid((prev) => ({
    ...prev,
    [`${name}IsValid`]: reg.test(value.trim())
  }));
};
    
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    try {
      // Validate payment fields with Stripe.
      // Error message code was implemented with help of ChatGPT and Stack Overflow: https://stackoverflow.com/questions/61149020/react-js-how-to-display-multiple-error-messages
    const { error: paymentError } = await elements.submit();

    const errors = [
      {
        type: "donorValidationError",
        message: !validateDonorFields()
          ? "Please enter a valid name and email."
          : ""
      },
      {
        type: "paymentValidationError",
        message: paymentError ? paymentError.message : ""
      }
    ];

    const errorMessage = errors
      .filter(error => error.message)
      .map(error => error.message)
      .join(" ");

    if (errorMessage) {
      setMessage(errorMessage);
      return;
    }

      // Only send non-sensitive donation data.
      const response = await fetch('/api/v1/donor-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: donor.firstName,
          lastName: donor.lastName,
          email: donor.email,
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
                    
                    <form onSubmit={handleSubmit}>
                        <Box
                        component="div"
                        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
                        autoComplete="off"
                        >
                            
                        <TextField
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            value={donor.firstName}
                            onChange={(e) => handleDonorFieldChange(e)}
                            error={!valid.firstNameIsValid}
                            required={true}
                        />
                        <TextField
                        name="lastName"
                        label="Last Name"
                        variant="outlined"
                        value={donor.lastName}
                        onChange={(e) => handleDonorFieldChange(e)}
                        error={!valid.lastNameIsValid}
                        required={true}
                        />

                        <TextField
                        name="email"
                        label="Email"
                        variant="outlined"
                        value={donor.email}
                        onChange={(e) => handleDonorFieldChange(e)}
                        error={!valid.emailIsValid}
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