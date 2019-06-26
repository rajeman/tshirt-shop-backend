import Stripe from 'stripe';
import models from '../models';
import emailTransporter from '../config/email';
import emailTemplate from '../helpers/emailTemplate';

const {
  orders, OrderDetail, Customer, Tax, Shipping
} = models;
const Order = orders;

const stripe = Stripe(process.env.STRIPE_API_KEY);

export default {
  async makePayment(req, res) {
    const { stripeToken, amount, description } = req.body;
    try {
      const charge = await stripe.charges.create({
        source: stripeToken,
        amount: amount * 100,
        description,
        currency: 'usd'
      });
      await Order.update(
        { status: 1 },
        { where: { order_id: req.body.order_id } }
      );
      const customerOrder = await Order.findOne({
        where: { order_id: req.body.order_id },
        include: [
          {
            model: OrderDetail
          },
          {
            model: Customer,
            attributes: ['name', 'email']
          },
          {
            model: Tax,
            attributes: ['tax_type', 'tax_percentage']
          },
          {
            model: Shipping,
            attributes: ['shipping_type', 'shipping_cost']
          }
        ]
      });

      emailTransporter.sendMail({
        from: '"Tshirt Shop Rajeman" <tshirtshop@rajeman.com>',
        to: `${customerOrder.Customer.email}`,
        subject: 'Order Details',
        html: emailTemplate(customerOrder)
      });

      res.send(charge);
    } catch (err) {
      res.status(400).send(err.message);
    }
  },

  receiveStripeData(req, res) {
    res.send({ received: true });
  }
};
