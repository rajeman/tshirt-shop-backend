import expect from 'expect';
import request from 'supertest';
import app from '../app';
import user from './001-base';

const orderUrl = '/api/v1/orders';

describe('ORDER TEST SUITE', () => {
  describe('Create Order', () => {
    it('should reject orders with empty required fields', async () => {
      const response = await request(app)
        .post(orderUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body.message).toBe('The cart_id field is required');
    });

    it('should reject orders with invalid supplied cart_id', async () => {
      const response = await request(app)
        .post(orderUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          shipping_id: 1,
          cart_id: '123',
          tax_id: 1
        });
      expect(response.body.message).toBe(
        'cart with supplied cart_id does not exist'
      );
    });

    it('should reject orders with invalid supplied shipping_id', async () => {
      const response = await request(app)
        .post(orderUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          shipping_id: 100,
          cart_id: 'abc-def',
          tax_id: 1
        });
      expect(response.body.message).toBe(
        'shipping with supplied shipping_id does not exist'
      );
    });

    it('should reject orders with invalid supplied tax_id', async () => {
      const response = await request(app)
        .post(orderUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          shipping_id: 1,
          cart_id: 'abc-def',
          tax_id: 100
        });
      expect(response.body.message).toBe(
        'tax with supplied tax_id does not exist'
      );
    });

    it('should successfully create order with valid fields', async () => {
      const response = await request(app)
        .post(orderUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          shipping_id: 1,
          cart_id: 'abc-def',
          tax_id: 1
        });
      expect(response.body.orderId).toBe(2);
    });
  });
});
