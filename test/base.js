import expect from 'expect';
import request from 'supertest';
import app from '../app';

describe('BASE URL TEST', () => {
  it('should reply with welcome message', () => request(app)
    .get('/fake-route')
    .set('Accept', 'application/json')
    .expect(404)
    .then((response) => {
      expect(response.body.message).toBeUndefined();
    }));
});
