import express from 'express';
import { shoppingCart } from '../controllers';
import { shoppingCartMiddleware, productsMiddleware } from '../middlewares';

const { generateUniqueId, addProductToCart, getItemsInCart } = shoppingCart;
const { verifyCartItemFields } = shoppingCartMiddleware;
const { verifyProductExists } = productsMiddleware;

const shoppingCartRouter = express.Router();

shoppingCartRouter.route('/generateUniqueId').get(generateUniqueId);

shoppingCartRouter
  .route('/add')
  .post(verifyCartItemFields, verifyProductExists, addProductToCart);

shoppingCartRouter.route('/:cart_id').get(getItemsInCart);

export default shoppingCartRouter;
