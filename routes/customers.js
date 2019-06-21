import express from 'express';
import { customers } from '../controllers';
import { customersMiddleware } from '../middlewares';

const { registerCustomer } = customers;
const { verifyRegistrationFields } = customersMiddleware;

const customersRouter = express.Router();
customersRouter.route('/').post(verifyRegistrationFields, registerCustomer);

export default customersRouter;
