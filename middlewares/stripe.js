import validators from '../helpers';

const { ensureRequiredFields, verifyFieldLength } = validators;

export default {
  async validatePaymentFields(req, res, next) {
    const emptyField = ensureRequiredFields(req, [
      'stripeToken',
      'order_id',
      'description'
    ]);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const { description, amount } = req.body;
    if (verifyFieldLength(description, 3, 500)) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'description must be within 3 and 500 characters',
        description,
        status: 400
      });
    }
    if (!Number.isInteger(amount) || amount < 0) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'amount must be a positive integer or 0',
        amount,
        status: 400
      });
    }

    next();
  }
};
