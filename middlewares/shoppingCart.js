import Sequelize from 'sequelize';
import models from '../models';
import validators from '../helpers';

const { or } = Sequelize.Op;
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
    const { quantity } = req.body;
    if (quantity && (!Number.isInteger(quantity) || quantity <= 0)) {
      return res.status(400).send({
        code: 'CAT_02',
        message: 'quantity must be a positive integer',
        quantity,
        status: 400
      });
    }
    next();
  },

  async verifyItemInCart(req, res, next) {
    const cartId = req.body.cart_id;
    const productId = req.body.product_id;
    const { attributes, quantity } = req.body;
    const item = await ShoppingCart.findOne({
      where: {
        cart_id: cartId,
        product_id: productId,
        [or]: [
          { attributes: attributes.trim().toLowerCase() },
          { attributes: `${attributes}|`.toLowerCase().trim() }
        ]
      }
    });
    if (item) {
      if (!quantity) {
        return res.status(400).send({
          code: 'SCAT_02',
          message: 'quantity must be supplied',
          quantity,
          status: 400
        });
      }
      req.cartItem = item;
    }
    next();
  },

  async verifyCartUpdateField(req, res, next) {
    const emptyField = ensureRequiredFields(req, ['quantity']);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const { quantity } = req.body;
    const quantityInt = parseInt(quantity, 10);
    if (Number.isNaN(quantityInt) || quantityInt < 1 || quantity > 1000000) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'quantity must be a positive integer within 1 and 1000000',
        quantity,
        status: 400
      });
    }
    const itemId = req.params.item_id;
    const item = await ShoppingCart.findByPk(itemId);
    if (!item) {
      return res.status(404).send({
        code: 'USR_03',
        message: 'item with supplied id does not exist',
        item_id: itemId,
        status: 404
      });
    }
    req.item = item;
    next();
  },
  async verifyItemExists(req, res, next) {
    const itemId = req.params.item_id;
    const item = await ShoppingCart.findByPk(itemId);
    if (!item) {
      return res.status(404).send({
        code: 'USR_03',
        message: 'item with supplied id does not exist',
        item_id: itemId,
        status: 404
      });
    }
    req.item = item;
    next();
  }
};
