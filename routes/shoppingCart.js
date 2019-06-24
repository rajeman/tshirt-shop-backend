import express from 'express';
import { shoppingCart } from '../controllers';
import { shoppingCartMiddleware, productsMiddleware } from '../middlewares';

const {
  generateUniqueId,
  addProductToCart,
  getItemsInCart,
  updateCartItem,
  deleteItemFromCart,
  getTotalAmountInCart
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

shoppingCartRouter.route('/empty/:cart_id').delete(deleteItemFromCart);

shoppingCartRouter.route('/totalAmount/:cart_id').get(getTotalAmountInCart);

export default shoppingCartRouter;
