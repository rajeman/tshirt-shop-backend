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

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(`${shippingUrl}/regions`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(4);
    });
  });

  describe('Get Shippings By Region Id', () => {
    it('should get all shippings with the supplied region_id', async () => {
      const response = await request(app)
        .get(`${shippingUrl}/regions/2`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(3);
    });

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(`${shippingUrl}/regions/2`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(3);
    });
  });
});
