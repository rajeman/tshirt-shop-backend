import cardValidator from 'card-validator';
import models from '../models';
import validators from '../helpers';

const { Customer, ShippingRegion } = models;
const {
  ensureRequiredFields,
  verifyFieldLength,
  verifyCustomerEmail,
  verifyFieldInUse,
  verifyOptionalFieldsLength
} = validators;

export default {
  async verifyRegistrationFields(req, res, next) {
    const emptyField = ensureRequiredFields(req, ['name', 'email', 'password']);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const { name, email, password } = req.body;
    if (verifyFieldLength(name, 3, 30)) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'name must be within 3 and 30 characters',
        name,
        status: 400
      });
    }
    const invalidEmail = verifyCustomerEmail(email);
    if (invalidEmail) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'email is invalid',
        email,
        status: 400
      });
    }
    const invalidPassword = verifyFieldLength(password, 6, 20);
    if (invalidPassword) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'password must be within 6 and 20 non-whitespace characters',
        password,
        status: 400
      });
    }

    const nameInUse = await verifyFieldInUse('name', name, Customer);
    if (nameInUse) {
      return res.status(409).send({
        code: 'USR_03',
        message: 'name in use',
        name,
        status: 409
      });
    }

    const emailInUse = await verifyFieldInUse('email', email, Customer);
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
    const emptyField = ensureRequiredFields(req, ['email', 'password']);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const { email, password } = req.body;
    const customer = await verifyFieldInUse('email', email, Customer);
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
  },
  async verifyUpdateFields(req, res, next) {
    const emptyField = ensureRequiredFields(req, ['name', 'email']);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const { name, email, password } = req.body;
    const invalidEmail = verifyCustomerEmail(email);
    if (invalidEmail) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'email is invalid',
        email,
        status: 400
      });
    }
    if (verifyFieldLength(name, 3, 30)) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'name must be within 3 and 30 characters',
        name,
        status: 400
      });
    }
    if (password) {
      const invalidPassword = verifyFieldLength(password, 6, 20);
      if (invalidPassword) {
        return res.status(400).send({
          code: 'USR_03',
          message: 'password must be within 6 and 20 non-whitespace characters',
          password,
          status: 400
        });
      }
    }
    const invalidOptionalField = verifyOptionalFieldsLength.bind(validators)(
      req,
      ['day_phone', 'eve_phone', 'mob_phone'],
      5,
      30
    );
    if (invalidOptionalField) {
      return res.status(400).send({
        code: 'USR_03',
        // eslint-disable-next-line max-len
        message: `${invalidOptionalField} must be within 5 and 30 non-whitespace characters`,
        [invalidOptionalField]: req.body[invalidOptionalField],
        status: 400
      });
    }

    const customerWithName = await verifyFieldInUse('name', name, Customer);
    if (
      customerWithName
      && customerWithName.customer_id !== req.decoded.customer_id
    ) {
      return res.status(409).send({
        code: 'USR_03',
        message: 'name in use',
        name,
        status: 409
      });
    }

    const customerWithEmail = await verifyFieldInUse('email', email, Customer);
    if (
      customerWithEmail
      && customerWithEmail.customer_id !== req.decoded.customer_id
    ) {
      return res.status(409).send({
        code: 'USR_03',
        message: 'email in use',
        email,
        status: 409
      });
    }
    next();
  },
  async verifyAddressFields(req, res, next) {
    const emptyField = ensureRequiredFields(req, [
      'address_1',
      'city',
      'country',
      'region',
      'postal_code',
      'shipping_region_id'
    ]);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }

    const invalidProvidedField = verifyOptionalFieldsLength.bind(validators)(
      req,
      ['address_1', 'address_2', 'city', 'country', 'region', 'postal_code'],
      3,
      90
    );
    if (invalidProvidedField) {
      return res.status(400).send({
        code: 'USR_03',
        // eslint-disable-next-line max-len
        message: `${invalidProvidedField} must be within 3 and 90 non-whitespace characters`,
        [invalidProvidedField]: req.body[invalidProvidedField],
        status: 400
      });
    }
    const shippingRegion = await ShippingRegion.findByPk(
      req.body.shipping_region_id
    );
    if (!shippingRegion) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'shipping region with supplied id does not exist',
        field: 'shipping_region_id',
        status: 400
      });
    }
    next();
  },
  verifyCreditCard(req, res, next) {
    const emptyField = ensureRequiredFields(req, ['credit_card']);
    if (emptyField) {
      return res.status(400).send({
        code: 'USR_03',
        message: `The ${emptyField} field is required`,
        field: emptyField,
        status: 400
      });
    }
    const creditCard = req.body.credit_card;
    const validatedCard = cardValidator.number(creditCard);

    if (!validatedCard.isValid) {
      return res.status(400).send({
        code: 'USR_08',
        message: 'this is an invalid Credit Card',
        field: 'credit_card',
        status: 400
      });
    }
    next();
  }
};
