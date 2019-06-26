import models from '../models';
import cache from '../config/redis';

const { getAsync, client } = cache;

const { Tax } = models;

export default {
  async getAllTaxes(req, res) {
    const cached = await getAsync('tax:all');
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const taxes = await Tax.findAll();
    client.set('tax:all', JSON.stringify(taxes));
    return res.send(taxes);
  },

  async getTaxById(req, res) {
    const taxId = req.params.tax_id;
    const cached = await getAsync(`tax:${taxId}`);
    if (cached) {
      return res.send(JSON.parse(cached));
    }
    const tax = await Tax.findByPk(req.params.tax_id);
    client.set(`tax:${taxId}`, JSON.stringify(tax));
    return res.send(tax);
  }
};
