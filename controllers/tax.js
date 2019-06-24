import models from '../models';

const { Tax } = models;

export default {
  async getAllTaxes(req, res) {
    const taxes = await Tax.findAll();
    return res.send(taxes);
  },

  async getTaxById(req, res) {
    const taxes = await Tax.findByPk(req.params.tax_id);
    return res.send(taxes);
  }
};
