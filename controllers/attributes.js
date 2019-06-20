import models from '../models';

const { Attribute } = models;

export default {
  async getAllAttributes(req, res) {
    const allAttributes = await Attribute.findAll();
    return res.send(allAttributes);
  },
  async getSingleAttribute(req, res) {
    const attribute = await Attribute.findByPk(req.params.attribute_id);
    return res.send(attribute);
  }
};
