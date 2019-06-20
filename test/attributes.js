import expect from 'expect';
import request from 'supertest';
import app from '../app';

const attributesUrl = '/api/v1/attributes';

describe('ATTRIBUTES TEST SUITE', () => {
  describe('Get Attributes', () => {
    it('should return all atrributes', async () => {
      const response = await request(app)
        .get(attributesUrl)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(2);
    });
  });

  describe('Get Single Attribute', () => {
    it('should return the specified attribute', async () => {
      const response = await request(app)
        .get(`${attributesUrl}/1`)
        .set('Accept', 'application/json');
      expect(response.body.attribute_id).toEqual(1);
    });
    it('should return 404 error for non-existing attribute', async () => {
      const response = await request(app)
        .get(`${attributesUrl}/10`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
    });
  });
});
