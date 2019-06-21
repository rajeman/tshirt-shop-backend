import Sequelize from 'sequelize';
import models from '../models';

const { like } = Sequelize.Op;
const { Customer } = models;

export default {
  async verifyRegistrationFields(req, res, next) {
    const requiredFields = ['name', 'email', 'password'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!req.body[field]) {
        return res.status(400).send({
          code: 'USR_03',
          message: `The ${field} field is required`,
          field,
          status: 400
        });
      }
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
  }
};
