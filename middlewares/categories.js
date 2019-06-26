import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;
const { Category } = models;
export default {
  verifyOrderParams(req, res, next) {
    const { order } = req.query;
    if (order) {
      const orderFields = ['name', 'category_id'];
      const orderTypes = ['ASC', 'DESC'];
      const orderArray = order.split(',');
      if (
        orderArray.length === 2
        && orderFields.includes(orderArray[0])
        && orderTypes.includes(orderArray[1])
      ) {
        req.order = [orderArray[0], orderArray[1]];
        return next();
      }
      return res.status(400).send({
        status: 400,
        code: 'PAG_01',
        message:
          "The order does not match format:'field,(DESC|ASC)'."
          + " Where field is 'name' or 'category_id'",
        order
      });
    }
    next();
  },
  async verifyCategoryExists(req, res, next) {
    const categoryId = req.params.category_id;
    const cached = await getAsync(`category:${categoryId}`);
    if (cached) {
      req.category = JSON.parse(cached);
      return next();
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).send({
        status: 404,
        code: 'CAT_01',
        message: 'category not found',
        category_id: categoryId
      });
    }
    client.set(`category:${categoryId}`, JSON.stringify(category));
    req.category = category;
    next();
  }
};
