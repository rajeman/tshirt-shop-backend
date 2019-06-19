import express from 'express';
import { categories } from '../controllers';
import { productsMiddleware, categoriesMiddleware } from '../middlewares';

const { getAllCategories } = categories;
const { isValidProductQueryParams } = productsMiddleware;
const { verifyOrderParams } = categoriesMiddleware;

const categoriesRouter = express.Router();

categoriesRouter
  .route('/')
  .get(verifyOrderParams, isValidProductQueryParams, getAllCategories);

export default categoriesRouter;
