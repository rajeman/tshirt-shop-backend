import express from 'express';
import { stripe } from '../controllers';
import { stripeMiddleware, ordersMiddleware } from '../middlewares';

const { makePayment, receiveStripeData } = stripe;
const { validatePaymentFields } = stripeMiddleware;
const { verifyOrderExists } = ordersMiddleware;

const stripeRouter = express.Router();

stripeRouter
  .route('/charge')
  .post(validatePaymentFields, verifyOrderExists, makePayment);
stripeRouter.route('/webhooks').post(receiveStripeData);

export default stripeRouter;
