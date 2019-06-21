import expect from 'expect';
import request from 'supertest';
import app from '../app';

const customersUrl = '/api/v1/customers';

describe('CUSTOMERS TEST SUITE', () => {
  describe('Register Customer', () => {
    it('should register a customer with valid details', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Habib',
          email: 'habib7019@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.name).toEqual('Habib');
    });

    it('should not register a customer with name in use', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Habib',
          email: 'habib7019@gmail.com',
          password: 'habibhabib'
        });
      expect(response.status).toEqual(409);
    });

    it('should not register a customer with email in use', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Mr Grace',
          email: 'habib7019@gmail.com',
          password: 'habibhabib'
        });
      expect(response.status).toEqual(409);
    });
  });

  describe('Validate Customer Input', () => {
    it('should not register a customer if name field is missing', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          email: 'habib7019@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual('The name field is required');
    });

    it('should not register a customer with email field missing', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Habib',
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual('The email field is required');
    });

    it('should not register a customer with no password field', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Mr Grace',
          email: 'habib7019@gmail.com'
        });
      expect(response.body.message).toEqual('The password field is required');
    });

    it('should not accept name field with less than 3 characters', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Mr',
          email: 'habib7019@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual(
        'name must be within 3 and 30 characters'
      );
    });

    it('should not accept invalid email field', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Mr Johnson',
          email: 'habib7019gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual('email is invalid');
    });

    it('should not accept invalid email field (> 40 chars)', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Mr Johnson',
          email: 'habib7019uuuuuuuuuuuuuuuuuuuuuuu@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual('email too long');
    });

    it('should not accept invalid password field (5 < p < 21)', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Mr Johnson',
          email: 'habib7089@gmail.com',
          password: 'habib'
        });
      expect(response.body.message).toEqual(
        'password must be within 6 and 20 non-whitespace characters'
      );
    });
  });
});
