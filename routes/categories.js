import express from 'express';
import { categories } from '../controllers';
import { productsMiddleware, categoriesMiddleware } from '../middlewares';

const {
  getAllCategories,
  getSingleCategory,
  getProductCategories
} = categories;
const { isValidProductQueryParams, verifyProductExists } = productsMiddleware;
const { verifyOrderParams, verifyCategoryExists } = categoriesMiddleware;

const categoriesRouter = express.Router();

categoriesRouter
  .route('/')
  .get(verifyOrderParams, isValidProductQueryParams, getAllCategories);

categoriesRouter
  .route('/:category_id')
  .get(verifyCategoryExists, getSingleCategory);

categoriesRouter
  .route('/inProduct/:product_id')
  .get(verifyProductExists, getProductCategories);

export default categoriesRouter;
