import jwt from 'jsonwebtoken';

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
  }
};
