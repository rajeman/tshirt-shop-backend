import models from '../models';

const { ShippingRegion } = models;

export default {
  async getAllShippingRegions(req, res) {
    const shippingRegions = await ShippingRegion.findAll();
    return res.send(shippingRegions);
  }
};
