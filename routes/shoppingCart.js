import express from 'express';
import { shoppingCart } from '../controllers';
import { shoppingCartMiddleware, productsMiddleware } from '../middlewares';

const {
  generateUniqueId,
  addProductToCart,
  getItemsInCart,
  updateCartItem
} = shoppingCart;
const { verifyCartItemFields, verifyCartUpdateField } = shoppingCartMiddleware;
const { verifyProductExists } = productsMiddleware;

const shoppingCartRouter = express.Router();

shoppingCartRouter.route('/generateUniqueId').get(generateUniqueId);

shoppingCartRouter
  .route('/add')
  .post(verifyCartItemFields, verifyProductExists, addProductToCart);

shoppingCartRouter.route('/:cart_id').get(getItemsInCart);

shoppingCartRouter
  .route('/update/:item_id')
  .put(verifyCartUpdateField, updateCartItem);

export default shoppingCartRouter;
