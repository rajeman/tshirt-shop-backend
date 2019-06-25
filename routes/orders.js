import express from 'express';
import { order } from '../controllers';
import { ordersMiddleware, authentication } from '../middlewares';

const { createOrder, getOrderDetails } = order;
const { verifyOrderFields, verifyUserMadeOrder } = ordersMiddleware;
const { verifyToken } = authentication;

const orderRouter = express.Router();

orderRouter.route('/').post(verifyToken, verifyOrderFields, createOrder);
orderRouter
  .route('/:order_id')
  .get(verifyToken, verifyUserMadeOrder, getOrderDetails);

export default orderRouter;
