import models from '../models';
import { getCartItems } from './shoppingCart';

const { ShoppingCart, OrderDetail, Order } = models;

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
  }
};
