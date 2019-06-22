import jwt from 'jsonwebtoken';
import models from '../models';

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

    return res.send({
      customer: {
        name: customer.name,
        email: customer.email,
        customer_id: customer.customer_id
      },
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
    return res.send({
      customer: {
        name: customer.name,
        email: customer.email,
        customer_id: customer.customer_id,
        address_1: customer.address_1,
        address_2: customer.address_2,
        city: customer.city,
        region: customer.region,
        postal_code: customer.postal_code,
        shipping_region_id: customer.shipping_region_id,
        credit_card: customer.credit_card,
        day_phone: customer.day_phone,
        eve_phone: customer.eve_phone,
        mob_phone: customer.mob_phone
      },
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
  }
};
