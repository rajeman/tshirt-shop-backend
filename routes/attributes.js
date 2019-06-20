import express from 'express';
import { attributes } from '../controllers';
import { attributesMiddleware, productsMiddleware } from '../middlewares';

const {
  getAllAttributes,
  getSingleAttribute,
  getAttributeValues,
  getProductAttributes
} = attributes;
const { verifyAttributeExists } = attributesMiddleware;
const { verifyProductExists } = productsMiddleware;

const attributesRouter = express.Router();
attributesRouter.route('/').get(getAllAttributes);

attributesRouter
  .route('/:attribute_id')
  .get(verifyAttributeExists, getSingleAttribute);

attributesRouter
  .route('/values/:attribute_id')
  .get(verifyAttributeExists, getAttributeValues);

attributesRouter
  .route('/inProduct/:product_id')
  .get(verifyProductExists, getProductAttributes);

export default attributesRouter;
