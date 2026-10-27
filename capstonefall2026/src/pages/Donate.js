import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from './CheckoutForm';

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

export default function Donate() {
  const options = {
    mode: 'payment',
    amount: 2500, // $25.00
    currency: 'usd',
    allowedPaymentMethodTypes: ['card'],
    paymentMethodCreation: 'manual'
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}