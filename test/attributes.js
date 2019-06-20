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
});
