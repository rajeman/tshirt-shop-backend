import Sequelize from 'sequelize';
import models from '../models';
import validators from '../helpers';

const { like } = Sequelize.Op;
const { Customer } = models;
const { ensureRequiredFields } = validators;

export default {
  async verifyRegistrationFields(req, res, next) {
    const invalidField = ensureRequiredFields(req, [
      'name',
      'email',
      'password'
    ]);
    if (invalidField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${invalidField} field is required`,
        field: invalidField,
        status: 400
      });
    }
    const { name, email, password } = req.body;
    if (`${name}`.trim().length < 3 || `${name}`.trim().length > 30) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'name must be within 3 and 30 characters',
        name,
        status: 400
      });
    }

    if (
      // eslint-disable-next-line no-useless-escape
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(`${email}`.trim())
    ) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'email is invalid',
        email,
        status: 400
      });
    }

    if (`${email}`.trim().length > 40) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'email too long',
        email,
        status: 400
      });
    }

    if (`${password}`.trim().length < 6 || `${password}`.trim().length > 20) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'password must be within 6 and 20 non-whitespace characters',
        password,
        status: 400
      });
    }

    const nameInUse = await Customer.findOne({
      where: { name: { [like]: `${name}`.trim() } }
    });
    if (nameInUse) {
      return res.status(409).send({
        code: 'USR_03',
        message: 'name in use',
        name,
        status: 409
      });
    }

    const emailInUse = await Customer.findOne({
      where: { email: { [like]: email.trim() } }
    });
    if (emailInUse) {
      return res.status(409).send({
        code: 'USR_03',
        message: 'email in use',
        email,
        status: 409
      });
    }
    next();
  },

  async verifyLoginFields(req, res, next) {
    const invalidField = ensureRequiredFields(req, ['email', 'password']);
    if (invalidField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${invalidField} field is required`,
        field: invalidField,
        status: 400
      });
    }
    const { email, password } = req.body;
    const customer = await Customer.findOne({
      where: { email: { [like]: email.trim() } }
    });
    if (!customer) {
      return res.status(400).send({
        code: 'USR_01',
        message: 'invalid email or password',
        field: 'email/password',
        status: 400
      });
    }
    const validPassword = await customer.validPassword(password);
    if (!validPassword) {
      return res.status(400).send({
        code: 'USR_01',
        message: 'invalid email or password',
        field: 'email/password',
        status: 400
      });
    }
    req.customer = customer;
    next();
  }
};
