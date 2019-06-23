import express from 'express';
import { shoppingCart } from '../controllers';

const { generateUniqueId } = shoppingCart;

const shoppingCartRouter = express.Router();

shoppingCartRouter.route('/generateUniqueId').get(generateUniqueId);

export default shoppingCartRouter;
