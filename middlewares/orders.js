import models from '../models';
import validators from '../helpers';

const {
  orders, ShoppingCart, Shipping, Tax
} = models;
const Order = orders;
const { ensureRequiredFields } = validators;

export default {
  async verifyOrderExists(req, res, next) {
    const order = await Order.findByPk(
      req.params.order_id || req.body.order_id
    );
    if (!order) {
      return res.status(404).send({
        code: 'USR_02',
        message: 'order with the supplied order_id not found',
        order_id: req.params.order_id || req.body.order_id,
        status: 404
      });
    }
    next();
  },
  async verifyUserMadeOrder(req, res, next) {
    const order = await Order.findByPk(req.params.order_id);
    if (!order || order.customer_id !== req.decoded.customer_id) {
      return res.status(404).send({
        code: 'USR_02',
        message: 'order not found for user',
        order_id: req.params.order_id || req.body.order_id,
        status: 404
      });
    }
    next();
  },
  async verifyOrderFields(req, res, next) {
    const emptyField = ensureRequiredFields(req, [
      'cart_id',
      'shipping_id',
      'tax_id'
    ]);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const cartId = req.body.cart_id;
    const cart = await ShoppingCart.findOne({
      where: { cart_id: cartId, buy_now: true }
    });
    if (!cart) {
      return res.status(404).send({
        code: 'USR_03',
        message: 'cart with supplied cart_id does not exist',
        cart_id: cartId,
        status: 404
      });
    }
    const shippingId = req.body.shipping_id;
    const shipping = await Shipping.findByPk(shippingId);
    if (!shipping) {
      return res.status(404).send({
        code: 'USR_03',
        message: 'shipping with supplied shipping_id does not exist',
        shipping_id: shippingId,
        status: 404
      });
    }
    req.shipping = shipping;
    const taxId = req.body.tax_id;
    const tax = await Tax.findByPk(taxId);
    if (!tax) {
      return res.status(404).send({
        code: 'USR_03',
        message: 'tax with supplied tax_id does not exist',
        tax_id: taxId,
        status: 404
      });
    }
    req.tax = tax;
    next();
  }
};
