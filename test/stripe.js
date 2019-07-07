import expect from 'expect';
import request from 'supertest';
import nock from 'nock';
import app from '../app';

const stripeUrl = '/api/v1/stripe';

describe('STRIPE TEST SUITE', () => {
  it('should acknowledge request receipt', async () => {
    const response = await request(app)
      .post(`${stripeUrl}/webhooks`)
      .set('Accept', 'application/json');
    expect(response.body.received).toBe(true);
  });

  it('should process customer payment with valid token', async () => {
    nock('https://api.stripe.com/v1')
      .post('/charges')
      .reply(200, { id: 'zixjs-sjknk', amount: 100 });
    const response = await request(app)
      .post(`${stripeUrl}/charge`)
      .set('Accept', 'application/json')
      .send({
        stripeToken: 'abcdefghij',
        order_id: 1,
        description: 'This is a great order',
        amount: 100
      });
    expect(response.body.amount).toEqual(100);
  });

  it('should not proccess payment with invalid token', async () => {
    nock('https://api.stripe.com/v1')
      .post('/charge')
      .reply((url, body, cb) => {
        cb(new Error('No such token'), [
          400,
          { code: 'resource_missing', message: 'No such token' }
        ]);
      });
    const response = await request(app)
      .post(`${stripeUrl}/charge`)
      .set('Accept', 'application/json')
      .send({
        stripeToken: 'some-invalid-token',
        order_id: 1,
        description: 'This is a great order',
        amount: 100
      });
    expect(response.body).toEqual({});
  });

  it('should not process request with invalid order_id', async () => {
    const response = await request(app)
      .post(`${stripeUrl}/charge`)
      .set('Accept', 'application/json')
      .send({
        stripeToken: 'valid token',
        order_id: 10,
        description: 'nice',
        amount: 10
      });
    expect(response.body.message).toEqual(
      'order with the supplied order_id not found'
    );
  });

  it('should not accept request with missing required fields', async () => {
    const response = await request(app)
      .post(`${stripeUrl}/charge`)
      .set('Accept', 'application/json');
    expect(response.body.message).toEqual('The stripeToken field is required');
  });

  it('should not accept request with non integer amount field', async () => {
    const response = await request(app)
      .post(`${stripeUrl}/charge`)
      .set('Accept', 'application/json')
      .send({
        stripeToken: 'valid token',
        order_id: 1,
        description: 'nice',
        amount: '12'
      });
    expect(response.body.message).toEqual(
      'amount must be a positive integer or 0'
    );
  });

  it('should not accept request with invalid description field', async () => {
    const response = await request(app)
      .post(`${stripeUrl}/charge`)
      .set('Accept', 'application/json')
      .send({
        stripeToken: 'valid token',
        order_id: 1,
        description: 'ab',
        amount: 12
      });
    expect(response.body.message).toEqual(
      'description must be within 3 and 500 characters'
    );
  });
});
