import jwt from 'jsonwebtoken';
import axios from 'axios';

const secret = process.env.SECRET_KEY;

export default {
  verifyToken(req, res, next) {
    let token;
    const userKey = req.headers['user-key'];
    if (userKey && userKey.split(' ').length === 2) {
      [token] = userKey.split(' ').slice(-1);
    }
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        return res.status(401).send({
          code: 'AUT_02',
          message: err.message,
          field: 'NoAuth',
          status: 401
        });
      }
      req.decoded = decoded;
      return next();
    });
  },
  async verifyFacebookToken(req, res, next) {
    const accessToken = req.body.access_token;
    if (!accessToken) {
      return res.status(400).send({
        code: 'USR_03',
        message: 'access_token is required',
        field: 'access_token',
        status: 400
      });
    }
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?access_token=${accessToken}&fields=name, email`
      );
      if (!response.data.email) {
        return res.status(400).send({
          code: 'USR_03',
          message: 'no facebook account email found for this user',
          field: 'fb_email',
          status: 400
        });
      }
      req.customer = response.data;
      return next();
    } catch (error) {
      return res.status(400).send({
        code: 'USR_03',
        message: error.message,
        field: 'access_token',
        status: 400
      });
    }
  }
};
