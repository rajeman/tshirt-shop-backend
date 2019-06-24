import express from 'express';
import { tax } from '../controllers';

const { getAllTaxes, getTaxById } = tax;

const taxRouter = express.Router();

taxRouter.route('/').get(getAllTaxes);
taxRouter.route('/:tax_id').get(getTaxById);

export default taxRouter;
