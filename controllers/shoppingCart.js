import uniqid from 'uniqid';
import models from '../models';

const { ShoppingCart, Product } = models;

export const getCartItems = async (cartId, savedForLater) => {
  const allItemsInSameCart = await ShoppingCart.findAll({
    where: { cart_id: cartId, buy_now: !savedForLater },
    include: [
      {
        model: Product,
        attributes: ['name', 'image', 'price', 'discounted_price']
      }
    ]
  });

  return allItemsInSameCart.map(item => ({
    item_id: item.item_id,
    attributes: item.attributes,
    product_id: item.product_id,
    quantity: item.quantity,
    name: item.Product.name,
    image: item.Product.image,
    price:
      parseFloat(item.Product.discounted_price) === 0
        ? item.Product.price
        : item.Product.discounted_price,
    subtotal:
      parseFloat(item.Product.discounted_price) === 0
        ? (item.Product.price * item.quantity).toFixed(2)
        : (item.Product.discounted_price * item.quantity).toFixed(2)
  }));
};

export default {
  async generateUniqueId(req, res) {
    return res.send({ cart_id: uniqid() });
  },

  async addProductToCart(req, res) {
    const cartId = req.body.cart_id;
    const productId = req.body.product_id;
    const { attributes } = req.body;
    await ShoppingCart.create({
      cart_id: cartId.trim(),
      product_id: productId,
      attributes: attributes.includes('|')
        ? attributes.trim().toLowerCase()
        : `${attributes.trim().toLowerCase()}|`,
      quantity: 1,
      buy_now: true,
      added_on: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
    });
    const cartItems = await getCartItems(cartId);
    return res.send(cartItems);
  },

  async getItemsInCart(req, res) {
    const cartId = req.params.cart_id;
    const cartItems = await getCartItems(cartId);
    return res.send(cartItems);
  },

  async updateCartItem(req, res) {
    const { quantity } = req.body;
    const quantityInt = parseInt(quantity, 10);
    await req.item.update({ quantity: quantityInt });
    const cartId = req.item.cart_id;
    const cartItems = await getCartItems(cartId);
    return res.send(cartItems);
  },

  async deleteItemsFromCart(req, res) {
    const cartId = req.params.cart_id;
    await ShoppingCart.destroy({
      where: { cart_id: cartId, buy_now: true }
    });
    return res.send([]);
  },

  async getTotalAmountInCart(req, res) {
    const cartId = req.params.cart_id;
    const cartItems = await getCartItems(cartId);
    return res.send({
      total_amount: cartItems.reduce(
        (previous, current) => previous + Number(current.subtotal),
        0
      )
    });
  },

  async saveItemForLater(req, res) {
    await req.item.update({ buy_now: false });
    return res.send();
  },

  async moveItemToCart(req, res) {
    await req.item.update({ buy_now: true });
    return res.send();
  },

  async getItemSavedForLater(req, res) {
    const cartId = req.params.cart_id;
    const cartItems = await getCartItems(cartId, true);
    return res.send(cartItems);
  },

  async deleteItemFromCart(req, res) {
    const itemId = req.params.item_id;
    await ShoppingCart.destroy({
      where: { item_id: itemId }
    });
    return res.send();
  }
};
