import expect from 'expect';
import request from 'supertest';
import app from '../app';

const categoriesUrl = '/api/v1/categories';

describe('CATEGORIES TEST SUITE', () => {
  describe('Get Categories', () => {
    it('should return max 20 categories with no filter', async () => {
      const response = await request(app)
        .get(categoriesUrl)
        .set('Accept', 'application/json');
      expect(response.body.rows.length).toEqual(7);
    });

    it('should return categories with names in ascending order', async () => {
      const response = await request(app)
        .get(`${categoriesUrl}?order=name,ASC`)
        .set('Accept', 'application/json');
      expect(response.body.rows[0].name).toEqual('Animal');
    });

    it('should return categories with ids in descending order', async () => {
      const response = await request(app)
        .get(`${categoriesUrl}?order=category_id,DESC`)
        .set('Accept', 'application/json');
      expect(response.body.rows[0].category_id).toEqual(7);
    });
  });

  describe('Validate Category Params', () => {
    it('should not permit order query param in invalid syntax', async () => {
      const response = await request(app)
        .get(`${categoriesUrl}?order=invalidsyntax`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual(
        'The order does not match '
          + "format:'field,(DESC|ASC)'. Where field is 'name' or 'category_id'"
      );
    });
  });

  describe('Get Single Category', () => {
    it('should get the category with specified id in params', async () => {
      const response = await request(app)
        .get(`${categoriesUrl}/2`)
        .set('Accept', 'application/json');
      expect(response.body.category_id).toEqual(2);
    });

    it('should return 404 error if category is not found', async () => {
      const response = await request(app)
        .get(`${categoriesUrl}/100`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
    });
  });
});
