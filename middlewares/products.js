import models from '../models';

const { Product, Department } = models;

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
    const product = await Product.findByPk(req.params.product_id);
    if (!product) {
      return res.status(404).send({
        code: 'USR_02',
        message: 'product with the supplied product_id not found',
        product_id: req.params.product_id,
        status: 500
      });
    }
    next();
  },
  async verifyDepartmentExists(req, res, next) {
    const department = await Department.findByPk(req.params.department_id);
    if (!department) {
      return res.status(404).send({
        code: 'USR_02',
        message: 'department with the supplied department_id not found',
        department_id: req.params.department_id,
        status: 500
      });
    }
    next();
  }
};
