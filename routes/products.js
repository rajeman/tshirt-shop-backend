import express from 'express';
import products from '../controllers';
import { productsMiddleware } from '../middlewares';

const { getAllProducts } = products;
const { isValidProductQueryParams } = productsMiddleware;

const productsRouter = express.Router();

productsRouter.route('/').get(isValidProductQueryParams, getAllProducts);

export default productsRouter;
