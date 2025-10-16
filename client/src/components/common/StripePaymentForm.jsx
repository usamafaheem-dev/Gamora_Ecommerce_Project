import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Alert, Spin } from 'antd';
import { CreditCard } from 'lucide-react';

const StripePaymentForm = ({ amount, onSuccess, onError, loading: parentLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (methodError) {
        setError(methodError.message);
        setLoading(false);
        return;
      }

      // Call your backend to create payment intent
      const response = await fetch('http://localhost:5000/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
        }),
      });

      const { clientSecret, error: backendError } = await response.json();

      if (backendError) {
        setError(backendError);
        setLoading(false);
        return;
      }

      // Confirm payment with card details
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={20} className="text-blue-500" />
        <span className="font-medium">Credit/Debit Card</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
        
        {error && (
          <Alert
            message="Payment Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-gray-50 rounded">
          <span>Total Amount:</span>
          <span className="font-semibold text-lg">Rs: {amount.toFixed(2)}</span>
        </div>
        
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={loading || parentLoading}
          disabled={!stripe || loading || parentLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 h-12"
          icon={loading ? <Spin size="small" /> : <CreditCard size={18} />}
        >
          {loading ? 'Processing Payment...' : `Pay Rs: ${amount.toFixed(2)}`}
        </Button>
      </form>
      
      <div className="text-xs text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by Stripe</p>
      </div>
    </div>
  );
};

export default StripePaymentForm;