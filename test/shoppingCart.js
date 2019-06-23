import expect from 'expect';
import request from 'supertest';
import app from '../app';

const shoppingCartUrl = '/api/v1/shoppingCart';

describe('SHOPPING CART TEST SUITE', () => {
  describe('Generate UniqueId', () => {
    it('should return a uniqueId', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/generateUniqueId`)
        .set('Accept', 'application/json');
      expect(response.body.cart_id).toBeTruthy();
    });
  });
});
