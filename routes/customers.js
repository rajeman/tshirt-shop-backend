import express from 'express';
import { customers } from '../controllers';
import { customersMiddleware, authentication } from '../middlewares';

const {
  registerCustomer,
  loginCustomer,
  updateCustomer,
  getCustomerById,
  updateCustomerAddress,
  updateCustomerCreditCard
} = customers;
const {
  verifyRegistrationFields,
  verifyLoginFields,
  verifyUpdateFields,
  verifyAddressFields,
  verifyCreditCard
} = customersMiddleware;
const { verifyToken } = authentication;

const customersRouter = express.Router();
customersRouter
  .route('/')
  .post(verifyRegistrationFields, registerCustomer)
  .put(verifyToken, verifyUpdateFields, updateCustomer)
  .get(verifyToken, getCustomerById);
customersRouter.route('/login').post(verifyLoginFields, loginCustomer);
customersRouter
  .route('/address')
  .put(verifyToken, verifyAddressFields, updateCustomerAddress);
customersRouter
  .route('/creditCard')
  .put(verifyToken, verifyCreditCard, updateCustomerCreditCard);

export default customersRouter;
