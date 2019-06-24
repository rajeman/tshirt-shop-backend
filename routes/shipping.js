import express from 'express';
import { shippingRegion } from '../controllers';

const { getAllShippingRegions, getShippingsByRegionId } = shippingRegion;

const shippingRegionRouter = express.Router();

shippingRegionRouter.route('/regions').get(getAllShippingRegions);
shippingRegionRouter
  .route('/regions/:shipping_region_id')
  .get(getShippingsByRegionId);

export default shippingRegionRouter;
