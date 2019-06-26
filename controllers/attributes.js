import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;
const { Attribute, AttributeValue, ProductAttribute } = models;

export default {
  async getAllAttributes(req, res) {
    const cached = await getAsync('attribute:all');
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const allAttributes = await Attribute.findAll();
    client.set('attribute:all', JSON.stringify(allAttributes));
    return res.send(allAttributes);
  },
  getSingleAttribute(req, res) {
    return res.send(req.attribute);
  },
  async getAttributeValues(req, res) {
    const attributeId = req.params.attribute_id;
    const cached = await getAsync(`attributeValue:${attributeId}`);
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const attributeValues = await AttributeValue.findAll({
      where: { attribute_id: attributeId },
      attributes: ['attribute_value_id', 'value']
    });
    client.set(
      `attributeValue:${attributeId}`,
      JSON.stringify(attributeValues)
    );
    return res.send(attributeValues);
  },
  async getProductAttributes(req, res) {
    const productId = req.params.product_id;
    const cached = await getAsync(`attributeProduct:${productId}`);
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const productAttributes = await ProductAttribute.findAll({
      where: { product_id: productId },
      include: [
        {
          model: AttributeValue,
          include: [
            {
              model: Attribute,
              attributes: ['name']
            }
          ],
          attributes: ['value']
        }
      ]
    });
    const response = productAttributes.map(item => ({
      attribute_value_id: item.attribute_value_id,
      attribute_name: item.AttributeValue.Attribute.name,
      attribute_value: item.AttributeValue.value
    }));
    client.set(`attributeProduct:${productId}`, JSON.stringify(response));
    return res.send(response);
  }
};
