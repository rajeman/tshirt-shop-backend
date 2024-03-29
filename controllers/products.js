import Sequelize from 'sequelize';
import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;

const {
  Product,
  ProductCategory,
  Category,
  Department,
  Review,
  Customer
} = models;
const { like, ne, or } = Sequelize.Op;

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
        [or]: {
          description: { [like]: queryString ? `%${queryString}%` : '%' },
          name: { [like]: queryString ? `%${queryString}%` : '%' }
        }
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
      offset: Number.isNaN(page) ? 0 : (page - 1) * (limit || defaultLimit)
    });
    return res.send({
      count: allProducts.count,
      rows: allProducts.rows
    });
  },
  async getSingleProduct(req, res) {
    return res.send(req.product);
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
          ],
          required: true
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
      offset: Number.isNaN(page) ? 0 : (page - 1) * (limit || defaultLimit)
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
      offset: Number.isNaN(page) ? 0 : (page - 1) * (limit || defaultLimit)
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
  },
  async getProductLocations(req, res) {
    const productId = req.params.product_id;
    const cached = await getAsync(`productLocation:${productId}`);
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const productLocations = await ProductCategory.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Category,
          include: [{ model: Department }],
          required: true
        }
      ]
    });
    const response = productLocations.map(productCategory => ({
      category_id: productCategory.Category.category_id,
      category_name: productCategory.Category.name,
      department_id: productCategory.Category.Department.department_id,
      department_name: productCategory.Category.Department.name
    }));
    client.set(`productLocation:${productId}`, JSON.stringify(response));
    return res.send(response);
  },
  async getProductReviews(req, res) {
    const productId = req.params.product_id;
    const productReviews = await Review.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Customer,
          attributes: ['name']
        }
      ]
    });
    return res.send(
      productReviews.map(review => ({
        name: review.Customer ? review.Customer.name : undefined,
        review: review.review,
        rating: review.rating,
        created_on: review.created_on
      }))
    );
  },
  async postProductReview(req, res) {
    const productId = req.params.product_id;
    const { rating, review } = req.body;
    await Review.create({
      rating: parseInt(rating, 10),
      review,
      customer_id: req.decoded.customer_id,
      product_id: productId,
      created_on: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
    });
    return res.send();
  }
};
