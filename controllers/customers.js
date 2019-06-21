import models from '../models';

const { Customer } = models;

export default {
  async registerCustomer(req, res) {
    const { name, email, password } = req.body;
    const newUser = await Customer.create({
      name,
      email,
      password
    });

    return res.send({
      name: newUser.name,
      email: newUser.email,
      customer_id: newUser.customer_id
    });
  }
};
