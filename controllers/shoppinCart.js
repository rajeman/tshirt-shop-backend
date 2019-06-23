import uniqid from 'uniqid';

export default {
  async generateUniqueId(req, res) {
    return res.send({ cart_id: uniqid() });
  }
};
