import expect from 'expect';
import request from 'supertest';
import app from '../app';
import user from './001-base';

const customersUrl = '/api/v1/customers';

describe('CUSTOMERS TEST SUITE', () => {
  describe('Register Customer', () => {
    it('should register a customer with valid details', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Habib2',
          email: 'habib7019t@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.customer.name).toEqual('Habib2');
    });

    it('should not register a customer with name in use', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Habib2',
          email: 'habib7019t@gmail.com',
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

  describe('Login Customer', () => {
    it('should login a customer with valid details', async () => {
      const response = await request(app)
        .post(`${customersUrl}/login`)
        .set('Accept', 'application/json')
        .send({
          email: 'habib7019t@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.customer.name).toEqual('Habib2');
    });

    it('should not login a customer with email field missing', async () => {
      const response = await request(app)
        .post(`${customersUrl}/login`)
        .set('Accept', 'application/json')
        .send({
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual('The email field is required');
    });

    it('should not login a customer with invalid email', async () => {
      const response = await request(app)
        .post(`${customersUrl}/login`)
        .set('Accept', 'application/json')
        .send({
          email: 'notuser@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual('invalid email or password');
    });

    it('should login a customer with invalid password', async () => {
      const response = await request(app)
        .post(`${customersUrl}/login`)
        .set('Accept', 'application/json')
        .send({
          email: 'habib7019t@gmail.com',
          password: 'habibhabibt'
        });
      expect(response.body.message).toEqual('invalid email or password');
    });
  });
});
