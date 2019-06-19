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
  }
};