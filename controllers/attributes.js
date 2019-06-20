import models from '../models';

const { Attribute } = models;

export default {
  async getAllAttributes(req, res) {
    const allAttributes = await Attribute.findAll();
    return res.send(allAttributes);
  }
};
