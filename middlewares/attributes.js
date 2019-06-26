import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;

const { Attribute } = models;
export default {
  async verifyAttributeExists(req, res, next) {
    const attributeId = req.params.attribute_id;
    const cached = await getAsync(`attribute:${attributeId}`);
    if (cached) {
      req.attribute = JSON.parse(cached);
      return next();
    }
    const attribute = await Attribute.findByPk(attributeId);
    if (!attribute) {
      return res.status(404).send({
        status: 500,
        code: 'USR_02',
        message: 'attribute not found',
        attribute_id: attributeId
      });
    }
    req.attribute = attribute;
    client.set(`attribute:${attributeId}`, JSON.stringify(attribute));
    next();
  }
};
