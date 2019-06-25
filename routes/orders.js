import express from 'express';
import { order } from '../controllers';
import { ordersMiddleware, authentication } from '../middlewares';

const {
  createOrder,
  getOrderDetails,
  getShortOrderDetails,
  getCustomersOrders
} = order;
const { verifyOrderFields, verifyUserMadeOrder } = ordersMiddleware;
const { verifyToken } = authentication;

const orderRouter = express.Router();

orderRouter.route('/').post(verifyToken, verifyOrderFields, createOrder);

orderRouter.route('/inCustomer').get(verifyToken, getCustomersOrders);
orderRouter
  .route('/:order_id')
  .get(verifyToken, verifyUserMadeOrder, getOrderDetails);

orderRouter
  .route('/shortDetail/:order_id')
  .get(verifyToken, verifyUserMadeOrder, getShortOrderDetails);

export default orderRouter;
