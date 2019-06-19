import expect from 'expect';
import request from 'supertest';
import app from '../app';

const productsUrl = '/api/v1/products';

describe('PRODUCTS TEST SUITE', () => {
  describe('Get Products', () => {
    it('should return 20 products when no limit param is passed', async () => {
      const response = await request(app)
        .get(productsUrl)
        .set('Accept', 'application/json');
      expect(response.body.rows.length).toEqual(20);
    });

    it('should return only the specified number of products', async () => {
      const response = await request(app)
        .get(`${productsUrl}?limit=10`)
        .set('Accept', 'application/json');
      expect(response.body.rows.length).toEqual(10);
    });

    it('should return the page specified by the page param', async () => {
      const response = await request(app)
        .get(`${productsUrl}?limit=20&page=2`)
        .set('Accept', 'application/json');
      expect(response.body.rows[0].product_id).toEqual(21);
    });

    it('should return the description_lenght specified', async () => {
      const response = await request(app)
        .get(`${productsUrl}?page=1&description_length=15`)
        .set('Accept', 'application/json');
      expect(response.body.rows[0].description.length).toEqual(15);
    });
  });

  describe('Validate Params', () => {
    it('should not permit a non-integer limit as param', async () => {
      const response = await request(app)
        .get(`${productsUrl}?limit=e`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual('limit must be at least 0');
    });

    it('should not permit specifying a non-integer page as param', async () => {
      const response = await request(app)
        .get(`${productsUrl}?page=e`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual('page must be a positive integer');
    });

    it('should permit a non-integer description_length as param', async () => {
      const response = await request(app)
        .get(`${productsUrl}?description_length=e`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual(
        'description_length must be at least 1'
      );
    });
  });
});
