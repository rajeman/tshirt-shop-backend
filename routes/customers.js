import express from 'express';
import { customers } from '../controllers';
import { customersMiddleware } from '../middlewares';

const { registerCustomer, loginCustomer } = customers;
const { verifyRegistrationFields, verifyLoginFields } = customersMiddleware;

const customersRouter = express.Router();
customersRouter.route('/').post(verifyRegistrationFields, registerCustomer);
customersRouter.route('/login').post(verifyLoginFields, loginCustomer);

export default customersRouter;
