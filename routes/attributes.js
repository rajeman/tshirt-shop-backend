import express from 'express';
import { attributes } from '../controllers';

const { getAllAttributes } = attributes;

const attributesRouter = express.Router();
attributesRouter.route('/').get(getAllAttributes);

export default attributesRouter;
