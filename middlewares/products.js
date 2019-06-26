import models from '../models';
import validators from '../helpers';
import cache from '../config/redis';

const { getAsync, client } = cache;
const { Product } = models;
const { ensureRequiredFields, verifyFieldLength } = validators;

export default {
  isValidProductQueryParams(req, res, next) {
    const { limit, page } = req.query;
    const descriptionLength = req.query.description_length;

    const pageInt = parseInt(page, 10);
    if ((page && Number.isNaN(pageInt)) || pageInt < 1) {
      return res.status(400).send({
        code: 'USR_02',
        message: 'page must be a positive integer',
        page,
        status: 500
      });
    }

    const limitInt = parseInt(limit, 10);
    if ((limit && Number.isNaN(limitInt)) || limitInt < 0) {
      return res.status(400).send({
        code: 'USR_02',
        message: 'limit must be at least 0',
        limit,
        status: 500
      });
    }

    const descriptionLengthInt = parseInt(descriptionLength, 10);
    if (
      (descriptionLength && Number.isNaN(descriptionLengthInt))
      || descriptionLengthInt < 1
    ) {
      return res.status(400).send({
        code: 'USR_02',
        message: 'description_length must be at least 1',
        description_length: descriptionLength,
        status: 500
      });
    }
    next();
  },
  isQueryStringSupplied(req, res, next) {
    const queryString = req.query.query_string;
    if (!queryString) {
      return res.status(400).send({
        code: 'USR_02',
        message: 'you must supply the query_string param',
        query_string: 'undefined',
        status: 500
      });
    }
    next();
  },
  async verifyProductExists(req, res, next) {
    const productId = req.params.product_id || req.body.product_id;
    const cached = await getAsync(`product:${productId}`);
    if (cached) {
      req.product = JSON.parse(cached);
      return next();
    }
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send({
        code: 'PRD_02',
        message: 'product with the supplied product_id not found',
        product_id: req.params.product_id,
        status: 500
      });
    }
    client.set(`product:${productId}`, JSON.stringify(product));
    req.product = product;
    next();
  },
  async verifyReviewParams(req, res, next) {
    const emptyField = ensureRequiredFields(req, ['review', 'rating']);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const { rating, review } = req.body;
    const ratingInt = parseInt(rating, 10);
    if (Number.isNaN(ratingInt) || ratingInt < 0 || ratingInt > 5) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'rating must be within 0 and 5. Decimals are ignored',
        field: 'rating',
        status: 400
      });
    }
    if (verifyFieldLength(review, 3, 1000)) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'review must be within 3 and 1000 characters',
        field: review,
        status: 400
      });
    }
    next();
  }
};
