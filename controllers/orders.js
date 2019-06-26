import models from '../models';
import { getCartItems } from './shoppingCart';

const { ShoppingCart, OrderDetail, orders } = models;
const Order = orders;

export default {
  async createOrder(req, res) {
    const cartItems = await getCartItems(req.body.cart_id);
    const itemsCost = cartItems.reduce(
      (previous, current) => previous + Number(current.subtotal),
      0
    );
    const orderCost = itemsCost
      + Number(req.shipping.shipping_cost)
      + (Number(req.tax.tax_percentage) / 100.0) * itemsCost;
    const newOrder = await Order.create({
      cart_id: req.body.cart_id,
      shipping_id: req.body.shipping_id,
      tax_id: req.body.tax_id,
      created_on: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      customer_id: req.decoded.customer_id,
      total_amount: orderCost
    });
    await Promise.all(
      cartItems.map(async (item) => {
        await OrderDetail.create({
          item_id: item.item_id,
          order_id: newOrder.order_id,
          product_id: item.product_id,
          attributes: item.attributes,
          product_name: item.name,
          quantity: item.quantity,
          unit_cost: item.price
        });
      })
    );
    await ShoppingCart.destroy({
      where: { cart_id: req.body.cart_id, buy_now: true }
    });
    res.send({ orderId: newOrder.order_id });
  },

  async getOrderDetails(req, res) {
    const orderDetails = await OrderDetail.findAll({
      where: { order_id: req.params.order_id }
    });
    return res.send(
      orderDetails.map(item => ({
        order_id: item.order_id,
        product_id: item.product_id,
        attributes: item.attributes,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        subt_total: (item.quantity * item.unit_cost).toFixed(2)
      }))
    );
  },

  async getShortOrderDetails(req, res) {
    const orderDetail = await Order.findByPk(req.params.order_id);
    return res.send({
      order_id: orderDetail.order_id,
      total_amount: orderDetail.total_amount,
      created_on: orderDetail.created_on,
      shipped_on: orderDetail.shipped_on,
      status: orderDetail.status,
      name: req.decoded.name
    });
  },

  async getCustomersOrders(req, res) {
    const orderDetails = await Order.findAll({
      where: { customer_id: req.decoded.customer_id }
    });
    return res.send(
      orderDetails.map(orderDetail => ({
        order_id: orderDetail.order_id,
        total_amount: orderDetail.total_amount,
        created_on: orderDetail.created_on,
        shipped_on: orderDetail.shipped_on,
        status: orderDetail.status,
        name: req.decoded.name
      }))
    );
  }
};
