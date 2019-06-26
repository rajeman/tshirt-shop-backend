import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;

const { ShippingRegion, Shipping } = models;

export default {
  async getAllShippingRegions(req, res) {
    const cached = await getAsync('shipping:all');
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const shippingRegions = await ShippingRegion.findAll();
    client.set('shipping:all', JSON.stringify(shippingRegions));
    return res.send(shippingRegions);
  },

  async getShippingsByRegionId(req, res) {
    const shippingRegionId = req.params.shipping_region_id;
    const cached = await getAsync(`shippingRegion:${shippingRegionId}`);
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const shippings = await Shipping.findAll({
      where: { shipping_region_id: shippingRegionId }
    });
    client.set(`shippingRegion:${shippingRegionId}`, JSON.stringify(shippings));
    return res.send(shippings);
  }
};
