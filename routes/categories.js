import express from 'express';
import { categories } from '../controllers';
import {
  productsMiddleware,
  categoriesMiddleware,
  departmentsMiddleware
} from '../middlewares';

const {
  getAllCategories,
  getSingleCategory,
  getProductCategories,
  getDepartmentCategories
} = categories;
const { isValidProductQueryParams, verifyProductExists } = productsMiddleware;
const { verifyDepartmentExists } = departmentsMiddleware;
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

categoriesRouter
  .route('/inDepartment/:department_id')
  .get(verifyDepartmentExists, getDepartmentCategories);

export default categoriesRouter;
