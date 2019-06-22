import expect from 'expect';
import request from 'supertest';
import app from '../app';

const protectedRoute = '/api/v1/customers';

describe('Update Customer Validations', () => {
  it('should refuse access with no token provided', async () => {
    const response = await request(app)
      .put(protectedRoute)
      .set('Accept', 'application/json')
      .send({
        email: 'habib7019t@gmail.com',
        name: 'habibhabib'
      });
    expect(response.body.message).toEqual('jwt must be provided');
  });

  it('should refuse access with invalid token provided', async () => {
    const response = await request(app)
      .put(protectedRoute)
      .set('Accept', 'application/json')
      .set('user-key', 'Bearer some-invalid-token')
      .send({
        email: 'habib7019t@gmail.com',
        name: 'habibhabib'
      });
    expect(response.body.message).toEqual('jwt malformed');
  });
});
