import uniqid from 'uniqid';
import models from '../models';

const { ShoppingCart, Product } = models;

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
      attributes: attributes.trim(),
      quantity: 1,
      buy_now: true,
      added_on: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
    });
    const allItemsInSameCart = await ShoppingCart.findAll({
      where: { cart_id: cartId },
      include: [{ model: Product, attributes: ['name', 'image', 'price'] }]
    });
    res.send(
      allItemsInSameCart.map(item => ({
        item_id: item.item_id,
        attributes: item.attributes,
        product_id: item.product_id,
        quantity: item.quantity,
        name: item.Product.name,
        image: item.Product.image,
        price: item.Product.price,
        subtotal: (parseFloat(item.Product.price) * item.quantity).toFixed(2)
      }))
    );
  }
};
