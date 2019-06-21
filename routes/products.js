import express from 'express';
import { products } from '../controllers';
import {
  productsMiddleware,
  departmentsMiddleware,
  categoriesMiddleware
} from '../middlewares';

const {
  getAllProducts,
  getSingleProduct,
  getDepartmentProducts,
  getCategoryProducts
} = products;
const {
  isValidProductQueryParams,
  isQueryStringSupplied,
  verifyProductExists
} = productsMiddleware;
const { verifyDepartmentExists } = departmentsMiddleware;
const { verifyCategoryExists } = categoriesMiddleware;

const productsRouter = express.Router();

productsRouter.route('/').get(isValidProductQueryParams, getAllProducts);

productsRouter
  .route('/search')
  .get(isQueryStringSupplied, isValidProductQueryParams, getAllProducts);

productsRouter
  .route(['/:product_id', '/:product_id/details'])
  .get(verifyProductExists, getSingleProduct);

productsRouter
  .route('/inDepartment/:department_id')
  .get(verifyDepartmentExists, getDepartmentProducts);

productsRouter
  .route('/inCategory/:category_id')
  .get(verifyCategoryExists, getCategoryProducts);

export default productsRouter;
