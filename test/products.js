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

  describe('Validate Product Params', () => {
    it('should not permit specifying non-integer limit as param', async () => {
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

    it('should not permit a non-integer description_length', async () => {
      const response = await request(app)
        .get(`${productsUrl}?description_length=e`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual(
        'description_length must be at least 1'
      );
    });

    it('should not permit searching without search param', async () => {
      const response = await request(app)
        .get(`${productsUrl}/search`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual(
        'you must supply the query_string param'
      );
    });
  });

  describe('Get Single Product', () => {
    it('should return the product with the supplied product_id', async () => {
      const response = await request(app)
        .get(`${productsUrl}/1`)
        .set('Accept', 'application/json');
      expect(response.body.product_id).toEqual(1);
    });

    it('should return 404 error if product is not found', async () => {
      const response = await request(app)
        .get(`${productsUrl}/1000`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
    });
  });

  describe('Search Products', () => {
    it('should return all products with matching description', async () => {
      const response = await request(app)
        .get(`${productsUrl}/search?query_string=beautiful&limit=5&page=2`)
        .set('Accept', 'application/json');
      expect(response.body.rows[0].description).toContain('beautiful');
    });
  });

  describe('Get Products in a Department', () => {
    it('should return all products in the supplied department', async () => {
      const response = await request(app)
        .get(`${productsUrl}/inDepartment/1`)
        .set('Accept', 'application/json');
      expect(response.body.count).toEqual(35);
    });
  });

  describe('Get Products in a Category', () => {
    it('should return all products in the supplied category', async () => {
      const response = await request(app)
        .get(`${productsUrl}/inCategory/1`)
        .set('Accept', 'application/json');
      expect(response.body.count).toEqual(18);
    });
  });
});
