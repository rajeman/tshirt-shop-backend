import models from '../models';

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
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).send({
        status: 500,
        code: 'USR_02',
        message: 'category not found',
        category_id: categoryId
      });
    }
    next();
  }
};
