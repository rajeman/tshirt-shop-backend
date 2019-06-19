import express from 'express';
import products from '../controllers';
import { productsMiddleware } from '../middlewares';

const { getAllProducts, getSingleProduct } = products;
const {
  isValidProductQueryParams,
  isQueryStringSupplied,
  verifyProductExists
} = productsMiddleware;

const productsRouter = express.Router();

productsRouter.route('/').get(isValidProductQueryParams, getAllProducts);

productsRouter
  .route('/search')
  .get(isQueryStringSupplied, isValidProductQueryParams, getAllProducts);

productsRouter.route('/:product_id').get(verifyProductExists, getSingleProduct);

export default productsRouter;
