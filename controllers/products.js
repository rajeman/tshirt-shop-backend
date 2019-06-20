import Sequelize from 'sequelize';
import models from '../models';

const { Product, ProductCategory, Category } = models;
const { like, ne } = Sequelize.Op;

const defaultLimit = 20;
const defaultDescriptionLength = 200;

export default {
  async getAllProducts(req, res) {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const descriptionLength = parseInt(req.query.description_length, 10);
    const queryString = req.query.query_string;

    const allProducts = await Product.findAndCountAll({
      order: [['product_id', 'ASC']],
      where: {
        description: { [like]: queryString ? `%${queryString}%` : '%' }
      },
      attributes: [
        'product_id',
        'name',
        [
          Sequelize.fn(
            'LEFT',
            Sequelize.col('description'),
            Number.isNaN(descriptionLength)
              ? defaultDescriptionLength
              : descriptionLength
          ),
          'description'
        ],
        'price',
        'discounted_price',
        'thumbnail'
      ],
      limit: Number.isNaN(limit) ? defaultLimit : limit,
      offset: Number.isNaN(page) ? 0 : (page - 1) * limit || defaultLimit
    });
    return res.send({
      count: allProducts.count,
      rows: allProducts.rows
    });
  },
  async getSingleProduct(req, res) {
    const product = await Product.findByPk(req.params.product_id);
    return res.send(product);
  },
  async getDepartmentProducts(req, res) {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const descriptionLength = parseInt(req.query.description_length, 10);
    const departmentId = req.params.department_id;

    const productsInDepartment = await Product.findAndCountAll({
      order: [['product_id', 'ASC']],
      subQuery: false,
      include: [
        {
          model: ProductCategory,
          where: { category_id: { [ne]: null } },
          include: [
            {
              model: Category,
              where: { department_id: departmentId },
              required: true
            }
          ]
        }
      ],
      distinct: true,
      attributes: [
        'product_id',
        'name',
        [
          Sequelize.fn(
            'LEFT',
            Sequelize.col('Product.description'),
            Number.isNaN(descriptionLength)
              ? defaultDescriptionLength
              : descriptionLength
          ),
          'description'
        ],
        'price',
        'discounted_price',
        'thumbnail',
        'display'
      ],
      limit: Number.isNaN(limit) ? defaultLimit : limit,
      offset: Number.isNaN(page) ? 0 : (page - 1) * limit || defaultLimit
    });
    return res.send({
      count: productsInDepartment.count,
      rows: productsInDepartment.rows.map(item => ({
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        price: item.price,
        discounted_price: item.discounted_price,
        thumbnail: item.thumbnail,
        display: item.display
      }))
    });
  },
  async getCategoryProducts(req, res) {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const descriptionLength = parseInt(req.query.description_length, 10);
    const categoryId = req.params.category_id;

    const productsInCategory = await Product.findAndCountAll({
      order: [['product_id', 'ASC']],
      subQuery: false,
      include: [
        {
          model: ProductCategory,
          where: { category_id: { [ne]: null } },
          include: [
            {
              model: Category,
              where: { category_id: categoryId },
              required: true
            }
          ]
        }
      ],
      distinct: true,
      attributes: [
        'product_id',
        'name',
        [
          Sequelize.fn(
            'LEFT',
            Sequelize.col('Product.description'),
            Number.isNaN(descriptionLength)
              ? defaultDescriptionLength
              : descriptionLength
          ),
          'description'
        ],
        'price',
        'discounted_price',
        'thumbnail',
        'display'
      ],
      limit: Number.isNaN(limit) ? defaultLimit : limit,
      offset: Number.isNaN(page) ? 0 : (page - 1) * limit || defaultLimit
    });
    return res.send({
      count: productsInCategory.count,
      rows: productsInCategory.rows.map(item => ({
        product_id: item.product_id,
        name: item.name,
        description: item.description,
        price: item.price,
        discounted_price: item.discounted_price,
        thumbnail: item.thumbnail,
        display: item.display
      }))
    });
  }
};
