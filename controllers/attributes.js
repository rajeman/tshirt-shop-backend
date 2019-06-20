import models from '../models';

const { Attribute, AttributeValue, ProductAttribute } = models;

export default {
  async getAllAttributes(req, res) {
    const allAttributes = await Attribute.findAll();
    return res.send(allAttributes);
  },
  async getSingleAttribute(req, res) {
    const attribute = await Attribute.findByPk(req.params.attribute_id);
    return res.send(attribute);
  },
  async getAttributeValues(req, res) {
    const attributeId = req.params.attribute_id;
    const attributeValues = await AttributeValue.findAll({
      where: { attribute_id: attributeId },
      attributes: ['attribute_value_id', 'value']
    });
    return res.send(attributeValues);
  },
  async getProductAttributes(req, res) {
    const productId = req.params.product_id;
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
    return res.send(
      productAttributes.map(item => ({
        attribute_value_id: item.attribute_value_id,
        attribute_name: item.AttributeValue.Attribute.name,
        attribute_value: item.AttributeValue.value
      }))
    );
  }
};
