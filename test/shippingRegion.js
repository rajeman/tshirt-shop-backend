import expect from 'expect';
import request from 'supertest';
import app from '../app';

const shippingUrl = '/api/v1/shipping';

describe('SHIPPING TEST SUITE', () => {
  describe('Get All Shipping Regions', () => {
    it('should get all shipping regions', async () => {
      const response = await request(app)
        .get(`${shippingUrl}/regions`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(4);
    });
  });
});
