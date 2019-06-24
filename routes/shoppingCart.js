import express from 'express';
import { shoppingCart } from '../controllers';
import { shoppingCartMiddleware, productsMiddleware } from '../middlewares';

const {
  generateUniqueId,
  addProductToCart,
  getItemsInCart,
  updateCartItem,
  deleteItemsFromCart,
  deleteItemFromCart,
  getTotalAmountInCart,
  saveItemForLater,
  getItemSavedForLater
} = shoppingCart;
const {
  verifyCartItemFields,
  verifyCartUpdateField,
  verifyItemExists
} = shoppingCartMiddleware;
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

shoppingCartRouter.route('/empty/:cart_id').delete(deleteItemsFromCart);

shoppingCartRouter.route('/totalAmount/:cart_id').get(getTotalAmountInCart);

shoppingCartRouter
  .route('/saveForLater/:item_id')
  .get(verifyItemExists, saveItemForLater);

shoppingCartRouter.route('/getSaved/:cart_id').get(getItemSavedForLater);

shoppingCartRouter.route('/removeProduct/:item_id').delete(deleteItemFromCart);

export default shoppingCartRouter;
