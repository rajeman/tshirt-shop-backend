import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import models from '../models';

const cardKey = process.env.CARD_ENCRYPTION_KEY;
const cardEncryptionAlgorithm = process.env.CARD_ENCRYPTION_ALGORITHM;

const { Customer } = models;

const secret = process.env.SECRET_KEY;
const expiryTime = { expiresIn: '72hrs' };
const generateToken = payload => jwt.sign(payload, secret, expiryTime);

export default {
  async registerCustomer(req, res) {
    const { name, email, password } = req.body;
    const customer = await Customer.create({
      name,
      email,
      password
    });
    customer.password = undefined;
    return res.send({
      customer,
      accessToken: `Bearer ${generateToken({
        customer_id: customer.customer_id,
        name: customer.name,
        role: 'customer'
      })}`,
      expires_in: expiryTime
    });
  },

  async loginCustomer(req, res) {
    const { customer } = req;
    customer.password = undefined;
    return res.send({
      customer,
      accessToken: `Bearer ${generateToken({
        customer_id: customer.customer_id,
        name: customer.name,
        role: 'customer'
      })}`,
      expires_in: expiryTime
    });
  },
  async updateCustomer(req, res) {
    const { username, email, password } = req.body;
    const dayPhone = req.body.day_phone;
    const evePhone = req.body.eve_phone;
    const mobPhone = req.body.mob_phone;

    const customer = await Customer.findByPk(req.decoded.customer_id);
    const updatedCustomer = await customer.update({
      username,
      email,
      password: password || customer.password,
      day_phone: dayPhone || customer.dayPhone,
      eve_phone: evePhone || customer.evePhone,
      mob_phone: mobPhone || customer.mobPhone
    });
    updatedCustomer.password = undefined;
    return res.send(updatedCustomer);
  },
  async getCustomerById(req, res) {
    const customer = await Customer.findByPk(req.decoded.customer_id);
    customer.password = undefined;
    return res.send(customer);
  },

  async updateCustomerAddress(req, res) {
    const { city, region, country } = req.body;
    const address1 = req.body.address_1;
    const address2 = req.body.address_2;
    const postalCode = req.body.postal_code;
    const shippingRegionId = req.body.shipping_region_id;

    const customer = await Customer.findByPk(req.decoded.customer_id);
    const updatedCustomer = await customer.update({
      city,
      region,
      country,
      address_1: address1,
      postal_code: postalCode,
      shipping_region_id: shippingRegionId,
      address_2: address2 || customer.address_2
    });
    updatedCustomer.password = undefined;
    return res.send(updatedCustomer);
  },
  async updateCustomerCreditCard(req, res) {
    const creditCard = req.body.credit_card;
    const customer = await Customer.findByPk(req.decoded.customer_id);

    const cipher = crypto.createCipher(cardEncryptionAlgorithm, cardKey);
    let crypted = cipher.update(JSON.stringify(creditCard), 'utf8', 'hex');
    crypted += cipher.final('hex');
    const updatedCustomer = await customer.update({ credit_card: crypted });
    updatedCustomer.password = undefined;
    updatedCustomer.credit_card = `******${creditCard.substr(
      creditCard.length - 4
    )}`;
    return res.send(updatedCustomer);
  },
  async authenticateFacebookUser(req, res) {
    const {
      customer: { email, name }
    } = req;
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (!existingCustomer) {
      const newCustomer = await Customer.create({
        email,
        name,
        password: Math.random()
          .toString(36)
          .substr(2, 15)
      });
      newCustomer.password = undefined;
      return res.send({
        customer: newCustomer,
        accessToken: `Bearer ${generateToken({
          customer_id: newCustomer.customer_id,
          name: newCustomer.name,
          role: 'customer'
        })}`,
        expires_in: expiryTime
      });
    }
    existingCustomer.password = undefined;
    return res.send({
      customer: existingCustomer,
      accessToken: `Bearer ${generateToken({
        customer_id: existingCustomer.customer_id,
        name: existingCustomer.name,
        role: 'customer'
      })}`,
      expires_in: expiryTime
    });
  }
};
