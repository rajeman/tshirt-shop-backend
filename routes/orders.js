import express from 'express';
import { order } from '../controllers';
import { ordersMiddleware, authentication } from '../middlewares';

const { createOrder } = order;
const { verifyOrderFields } = ordersMiddleware;
const { verifyToken } = authentication;

const orderRouter = express.Router();

orderRouter.route('/').post(verifyToken, verifyOrderFields, createOrder);

export default orderRouter;
