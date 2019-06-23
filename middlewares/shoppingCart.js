import models from '../models';
import validators from '../helpers';

const { ShoppingCart } = models;
const { ensureRequiredFields, verifyFieldLength } = validators;

export default {
  async verifyCartItemFields(req, res, next) {
    const emptyField = ensureRequiredFields(req, [
      'cart_id',
      'product_id',
      'attributes'
    ]);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const { attributes } = req.body;
    if (verifyFieldLength(attributes, 3, 1000)) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'attributes must be within 3 and 900 characters',
        field: attributes,
        status: 400
      });
    }
    const cartId = req.body.cart_id;
    if (verifyFieldLength(cartId, 3, 25)) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'cart_id must be within 3 and 25 characters',
        field: cartId,
        status: 400
      });
    }
    const productId = req.body.product_id;
    const productInCart = await ShoppingCart.findOne({
      where: {
        cart_id: `${cartId}`.trim(),
        product_id: productId
      }
    });
    if (productInCart) {
      return res.status(409).send({
        code: 'USR_03',
        message: 'product already in cart',
        product_id: productId,
        status: 409
      });
    }
    next();
  }
};
