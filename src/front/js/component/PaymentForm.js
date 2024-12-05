import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = ({ sessionTotal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    setPaymentProcessing(true);
    setError(null);
    setSuccess(false);

    // Call your backend to create a PaymentIntent
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: (sessionTotal * 100 ) }), // amount in cents ($5000.00)
        }
      );

      const { clientSecret } = await response.json();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        console.error(error);
        setError(error.message);
      } else {
        if (paymentIntent.status === "succeeded") {
          setSuccess(true);
          console.log("Payment successful!");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing the payment.");
    }

    setPaymentProcessing(false);
  };

  return (
    <div className="card mx-auto shadow-sm" style={{ maxWidth: '800px', width: '100%' }}>
      <div className="card-header bg-primary text-white text-center">
        <h4 className="mb-0">Payment Details</h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="cardDetails" className="form-label">Card Details</label>
            <div className="border rounded p-2">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }} 
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success mt-3" role="alert">
              Payment successful!
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-100 mt-3" 
            disabled={paymentProcessing || !stripe}
          >
            {paymentProcessing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processing...
              </>
            ) : (
              // 'Pay $5,000.00'
              `Pay $${sessionTotal}.00`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;