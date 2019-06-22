import express from 'express';
import { customers } from '../controllers';
import { customersMiddleware, authentication } from '../middlewares';

const { registerCustomer, loginCustomer, updateCustomer } = customers;
const {
  verifyRegistrationFields,
  verifyLoginFields,
  verifyUpdateFields
} = customersMiddleware;
const { verifyToken } = authentication;

const customersRouter = express.Router();
customersRouter
  .route('/')
  .post(verifyRegistrationFields, registerCustomer)
  .put(verifyToken, verifyUpdateFields, updateCustomer);

customersRouter.route('/login').post(verifyLoginFields, loginCustomer);

export default customersRouter;
