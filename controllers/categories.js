import Sequelize from 'sequelize';
import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;

const { ne } = Sequelize.Op;
const { Category, ProductCategory } = models;

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
  },
  async getSingleCategory(req, res) {
    return res.send(req.category);
  },
  async getProductCategories(req, res) {
    const productId = req.params.product_id;
    const cached = await getAsync(`productCategories:${productId}`);
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const productCategories = await ProductCategory.findAll({
      wheres: { product_id: productId },
      include: [
        {
          model: Category,
          attributes: ['category_id', 'department_id', 'name'],
          where: { category_id: { [ne]: null } }
        }
      ]
    });
    const response = productCategories.map(item => item.Category);
    client.set(`productCategories:${productId}`, JSON.stringify(response));
    return res.send(response);
  },
  async getDepartmentCategories(req, res) {
    const departmentId = req.params.department_id;
    const cached = await getAsync(`departmentCategories:${departmentId}`);
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const departmentCategories = await Category.findAll({
      where: { department_id: departmentId }
    });
    client.set(
      `departmentCategories:${departmentId}`,
      JSON.stringify(departmentCategories)
    );
    return res.send(departmentCategories);
  }
};
