import expect from 'expect';
import request from 'supertest';
import cache from '../config/redis';

import app from '../app';
import user from './001-base';

const { client } = cache;
const productsUrl = '/api/v1/products';

describe('PRODUCTS TEST SUITE', () => {
  before((done) => {
    client.flushall(() => {
      done();
    });
  });
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

    it('should return the description_length specified', async () => {
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

  describe('Get Product Locations', () => {
    it('should return all locations of the suplied product', async () => {
      const response = await request(app)
        .get(`${productsUrl}/1/locations`)
        .set('Accept', 'application/json');
      expect(response.body[0].category_name).toEqual('French');
    });

    it('should return the caches response', async () => {
      const response = await request(app)
        .get(`${productsUrl}/1/locations`)
        .set('Accept', 'application/json');
      expect(response.body[0].category_name).toEqual('French');
    });
  });

  describe('Get Product Reviews', () => {
    it('should return all reviews of the suplied product', async () => {
      const response = await request(app)
        .get(`${productsUrl}/1/reviews`)
        .set('Accept', 'application/json');
      expect(response.body[0].name).toEqual('Rajeman');
    });
  });

  describe('Post Product Review', () => {
    it('should post a review for the product specified with id', async () => {
      const response = await request(app)
        .post(`${productsUrl}/1/reviews`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({ review: 'Wao I am impressed', rating: 4 });
      expect(response.status).toEqual(200);
    });

    it('should not accept request with missing required field', async () => {
      const response = await request(app)
        .post(`${productsUrl}/1/reviews`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({ review: 'Wao I am impressed' });
      expect(response.body.message).toEqual('The rating field is required');
    });

    it('should not accept request with review less than 3 chars', async () => {
      const response = await request(app)
        .post(`${productsUrl}/1/reviews`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({ review: 'st', rating: 2 });
      expect(response.body.message).toEqual(
        'review must be within 3 and 1000 characters'
      );
    });

    it('should not accept request with non integer rating', async () => {
      const response = await request(app)
        .post(`${productsUrl}/1/reviews`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({ review: 'st', rating: 'e' });
      expect(response.body.message).toEqual(
        'rating must be within 0 and 5. Decimals are ignored'
      );
    });
  });
});
