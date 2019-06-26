import expect from 'expect';
import request from 'supertest';
import app from '../app';

const taxUrl = '/api/v1/tax';

describe('TAX TEST SUITE', () => {
  describe('Get All Taxes', () => {
    it('should get all taxes', async () => {
      const response = await request(app)
        .get(taxUrl)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(2);
    });

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(taxUrl)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(2);
    });

    it('should get the tax with specified id', async () => {
      const response = await request(app)
        .get(`${taxUrl}/1`)
        .set('Accept', 'application/json');
      expect(response.body.tax_percentage).toEqual('8.50');
    });

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(`${taxUrl}/1`)
        .set('Accept', 'application/json');
      expect(response.body.tax_percentage).toEqual('8.50');
    });
  });
});
