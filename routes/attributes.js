import express from 'express';
import { attributes } from '../controllers';
import { attributesMiddleware } from '../middlewares';

const { getAllAttributes, getSingleAttribute } = attributes;
const { verifyAttributeExists } = attributesMiddleware;

const attributesRouter = express.Router();
attributesRouter.route('/').get(getAllAttributes);
attributesRouter
  .route('/:attribute_id')
  .get(verifyAttributeExists, getSingleAttribute);

export default attributesRouter;
