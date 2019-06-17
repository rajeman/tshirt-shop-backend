import expect from 'expect';
import request from 'supertest';
import app from '../app';

describe('BASE URL TEST', () => {
  it('should reply with welcome message', () => request(app)
    .get('/')
    .set('Accept', 'application/json')
    .expect(200)
    .then((response) => {
      expect(response.body.message).toBe('Welcome to tshirt shop');
    }));
});
