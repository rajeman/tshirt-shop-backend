import Sequelize from 'sequelize';
import models from '../models';

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
    const categoryId = req.params.category_id;
    const category = await Category.findByPk(categoryId);
    return res.send(category);
  },
  async getProductCategories(req, res) {
    const productId = req.params.product_id;
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
    return res.send(productCategories.map(item => item.Category));
  },
  async getDepartmentCategories(req, res) {
    const departmentId = req.params.department_id;
    const departmentCategories = await Category.findAll({
      where: { department_id: departmentId }
    });
    return res.send(departmentCategories);
  }
};
