import models from '../models';

const { ShippingRegion, Shipping } = models;

export default {
  async getAllShippingRegions(req, res) {
    const shippingRegions = await ShippingRegion.findAll();
    return res.send(shippingRegions);
  },

  async getShippingsByRegionId(req, res) {
    const shippingRegionId = req.params.shipping_region_id;
    const shippings = await Shipping.findAll({
      where: { shipping_region_id: shippingRegionId }
    });

    return res.send(shippings);
  }
};
