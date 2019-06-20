import models from '../models';

const { Attribute } = models;
export default {
  async verifyAttributeExists(req, res, next) {
    const attributeId = req.params.attribute_id;
    const attribute = await Attribute.findByPk(attributeId);
    if (!attribute) {
      return res.status(404).send({
        status: 500,
        code: 'USR_02',
        message: 'attribute not found',
        attribute_id: attributeId
      });
    }
    next();
  }
};
