import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_API_KEY);

export default {
  async makePayment(req, res) {
    try {
      const customer = await stripe.customers.create({});
      res.send(customer);
    } catch (err) {
      res.send(err.message);
    }
  },

  receiveStripeData(req, res) {
    res.send({ received: true });
  }
};
