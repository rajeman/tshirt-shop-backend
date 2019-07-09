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
  getItemSavedForLater,
  moveItemToCart
} = shoppingCart;
const {
  verifyCartItemFields,
  verifyCartUpdateField,
  verifyItemExists,
  verifyItemInCart
} = shoppingCartMiddleware;
const { verifyProductExists } = productsMiddleware;

const shoppingCartRouter = express.Router();

shoppingCartRouter.route('/generateUniqueId').get(generateUniqueId);

shoppingCartRouter
  .route('/add')
  .post(
    verifyCartItemFields,
    verifyProductExists,
    verifyItemInCart,
    addProductToCart
  );

shoppingCartRouter
  .route('/update/:item_id')
  .put(verifyCartUpdateField, updateCartItem);

shoppingCartRouter.route('/empty/:cart_id').delete(deleteItemsFromCart);

shoppingCartRouter.route('/totalAmount/:cart_id').get(getTotalAmountInCart);

shoppingCartRouter
  .route('/saveForLater/:item_id')
  .get(verifyItemExists, saveItemForLater);

shoppingCartRouter
  .route('/moveToCart/:item_id')
  .get(verifyItemExists, moveItemToCart);

shoppingCartRouter.route('/getSaved/:cart_id').get(getItemSavedForLater);

shoppingCartRouter.route('/removeProduct/:item_id').delete(deleteItemFromCart);

shoppingCartRouter.route('/:cart_id').get(getItemsInCart);

export default shoppingCartRouter;
