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

  describe('Get Order Details', async () => {
    it('should get the details of an order', async () => {
      const response = await request(app)
        .get(`${orderUrl}/2`)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body[0].order_id).toBe(2);
    });

    it('should reply with 404 if order not found for user', async () => {
      const response = await request(app)
        .get(`${orderUrl}/3`)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body.message).toBe('order not found for user');
    });

    it('should get all orders of a customer', async () => {
      const response = await request(app)
        .get(`${orderUrl}/inCustomer`)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body.length).toBe(2);
    });

    it('should get short details of an order', async () => {
      const response = await request(app)
        .get(`${orderUrl}/shortDetail/2`)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body.name).toEqual('Habib');
    });
  });
});
