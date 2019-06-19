import Sequelize from 'sequelize';
import models from '../models';

const { Product } = models;

export default {
  async getAllProducts(req, res) {
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10);
    const descriptionLength = parseInt(req.query.description_length, 10);

    const defaultLimit = 20;
    const defaultDescriptionLength = 200;

    const allProducts = await Product.findAndCountAll({
      order: [['product_id', 'ASC']],
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
  }
};
