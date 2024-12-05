import React from "react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import PaymentForm from "../component/PaymentForm"; // Component to handle payment form
import Payouts from "../component/Payouts"; // Component to handle provider payouts

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const PaymentsPayouts = ({ sessionTotal }) => {
  return (
    <div className="payments-payouts">
      <h2>Payments & Payouts</h2>
      <Elements stripe={stripePromise}>
        <PaymentForm
          // mentor={store.selectedMentor}
          // session={session} 
          sessionTotal={sessionTotal}
        /> {/* For clients to make payments */}
        <Payouts /> {/* For providers to receive payouts */}
      </Elements>
    </div>
  );
};
export default PaymentsPayouts;
