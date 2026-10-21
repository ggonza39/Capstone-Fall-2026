import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";

// This was developed using ChatGPT (entered prompt given by Stripe website)
export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');

    try {
      // Validate payment fields with Stripe.
      const { error } = await elements.submit();

      if (error) {
        setMessage(error.message);
        return;
      }

      // Only send non-sensitive donation data.
      const response = await fetch('/api/v1/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2500,
          currency: 'usd',
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
                        <Stack spacing={2}>
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