// const express = require("express");
import express from "express";
const app = express();
// This is your test secret API key.
// const stripe = require("stripe")('sk_test_51Of4i3SF6PTHbMjJTRPTG2IjMxAr5TBBAtsxEPQyQy053ryM5twBBqfa3nPzEaX3S6uIo0jhuCPaCvvlACDlM4mt00pXfHGfST');
import stripe from "stripe";
app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.listen(4242, () => console.log("Node server listening on port 4242!"));