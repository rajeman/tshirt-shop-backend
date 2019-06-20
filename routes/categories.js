import express from 'express';
import { categories } from '../controllers';
import { productsMiddleware, categoriesMiddleware } from '../middlewares';

const { getAllCategories, getSingleCategory } = categories;
const { isValidProductQueryParams } = productsMiddleware;
const { verifyOrderParams, verifyCategoryExists } = categoriesMiddleware;

const categoriesRouter = express.Router();

categoriesRouter
  .route('/')
  .get(verifyOrderParams, isValidProductQueryParams, getAllCategories);

categoriesRouter
  .route('/:category_id')
  .get(verifyCategoryExists, getSingleCategory);

export default categoriesRouter;
