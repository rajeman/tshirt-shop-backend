import expect from 'expect';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import models from '../models';
import app from '../app';

const customersUrl = '/api/v1/customers';
const user = { token: '' };

describe('SETUP TEST', () => {
  before(async () => {
    const sql = await fs.promises.readFile(
      path.join(__dirname, '../migrations/tshirtshop.sql'),
      'utf8'
    );
    await models.sequelize.query(sql);
  });

  it('should reply 404 error', async () => {
    const response = await request(app)
      .get('/fake-route')
      .set('Accept', 'application/json');
    expect(response.body.message).toBeUndefined();
  });

  describe('Register a Customer', () => {
    it('should register a customer with valid details', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Habib',
          email: 'habib7019@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.customer.name).toEqual('Habib');
      user.token = response.body.accessToken;
    });
  });
});

export default user;
