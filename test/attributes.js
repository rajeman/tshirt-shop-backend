import expect from 'expect';
import request from 'supertest';
import app from '../app';
import cache from '../config/redis';

const { client } = cache;

const attributesUrl = '/api/v1/attributes';

describe('ATTRIBUTES TEST SUITE', () => {
  before((done) => {
    client.flushall(() => {
      done();
    });
  });
  describe('Get Attributes', () => {
    it('should return all atrributes', async () => {
      const response = await request(app)
        .get(attributesUrl)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(2);
    });

    it('should return the cached response', async () => {
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

  describe('Get Product Attributes', () => {
    it('should return the attributes of the products', async () => {
      const response = await request(app)
        .get(`${attributesUrl}/inProduct/1`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(14);
    });

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(`${attributesUrl}/inProduct/1`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(14);
    });

    it('should return the attribute values', async () => {
      const response = await request(app)
        .get(`${attributesUrl}/values/1`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(5);
    });

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(`${attributesUrl}/values/1`)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(5);
    });
  });
});
