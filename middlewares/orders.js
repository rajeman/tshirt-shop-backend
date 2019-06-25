import models from '../models';

const { Order } = models;

export default {
  async verifyOrderExists(req, res, next) {
    const order = await Order.findByPk(
      req.params.order_id || req.body.order_id
    );
    if (!order) {
      return res.status(404).send({
        code: 'USR_02',
        message: 'order with the supplied order_id not found',
        order_id: req.params.order_id || req.body.order_id,
        status: 404
      });
    }
    next();
  }
};
