import express from 'express';
import products from '../controllers';
import { productsMiddleware } from '../middlewares';

const { getAllProducts } = products;
const { isValidProductQueryParams, isQueryStringSupplied } = productsMiddleware;

const productsRouter = express.Router();

productsRouter.route('/').get(isValidProductQueryParams, getAllProducts);
productsRouter
  .route('/search')
  .get(isQueryStringSupplied, isValidProductQueryParams, getAllProducts);

export default productsRouter;
