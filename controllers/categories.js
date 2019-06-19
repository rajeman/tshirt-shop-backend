import models from '../models';

const { Category } = models;

export default {
  async getAllCategories(req, res) {
    const { order } = req;
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const defaultLimit = 20;

    const allCategories = await Category.findAndCountAll({
      order: order ? [[...order]] : [],
      limit: Number.isNaN(limit) ? defaultLimit : limit,
      offset: Number.isNaN(page) ? 0 : (page - 1) * limit || defaultLimit
    });

    return res.send({
      count: allCategories.count,
      rows: allCategories.rows
    });
  }
};
