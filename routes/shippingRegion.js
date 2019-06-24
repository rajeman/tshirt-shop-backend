import express from 'express';
import { shippingRegion } from '../controllers';

const { getAllShippingRegions } = shippingRegion;

const shippingRegionRouter = express.Router();

shippingRegionRouter.route('/regions').get(getAllShippingRegions);

export default shippingRegionRouter;
