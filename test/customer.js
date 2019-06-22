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

    it('should not accept email field greater than 40 chars', async () => {
      const response = await request(app)
        .post(customersUrl)
        .set('Accept', 'application/json')
        .send({
          name: 'Mr Johnson',
          email: 'habib7019uuuuuuuuuuuuuuuuuuuuuuu@gmail.com',
          password: 'habibhabib'
        });
      expect(response.body.message).toEqual('email is invalid');
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

    it('should not login a customer with invalid password', async () => {
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

  describe('Update Customer', () => {
    it('should update a customer with valid required details', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019@gmail.com',
          name: 'habibhabib'
        });
      expect(response.body.email).toEqual('habib7019@gmail.com');
    });

    it('should update a customer with valid eve_phone supplied', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019@gmail.com',
          name: 'habibhabib',
          eve_phone: '0819723801',
          password: 'mynottoolongpassword'
        });
      expect(response.body.eve_phone).toEqual('0819723801');
    });

    it('should not update a customer with name not supplied', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019@gmail.com'
        });
      expect(response.body.message).toEqual('The name field is required');
    });

    it('should not update a customer with invalid day_phone', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019@gmail.com',
          name: 'habibhabib',
          day_phone: '7'
        });
      expect(response.body.message).toEqual(
        'day_phone must be within 5 and 30 non-whitespace characters'
      );
    });

    it('should not update a customer with password too short', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019@gmail.com',
          name: 'habibhabib',
          password: '123'
        });
      expect(response.body.message).toEqual(
        'password must be within 6 and 20 non-whitespace characters'
      );
    });

    it('should not update a customer with invalid email', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019gmail.com',
          name: 'habibhabib'
        });
      expect(response.body.message).toEqual('email is invalid');
    });

    it('should not update a customer with invalid name', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019@gmail.com',
          name: 'ha'
        });
      expect(response.body.message).toEqual(
        'name must be within 3 and 30 characters'
      );
    });

    it('should not update a customer with email in use', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib7019t@gmail.com',
          name: 'habibhabib'
        });
      expect(response.body.message).toEqual('email in use');
    });

    it('should not update a customer with name in use', async () => {
      const response = await request(app)
        .put(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          email: 'habib70@gmail.com',
          name: 'habib2'
        });
      expect(response.body.message).toEqual('name in use');
    });
  });

  describe('Get Customer', () => {
    it('should not return the authorized customer', async () => {
      const response = await request(app)
        .get(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body.name).toEqual('Habib');
    });
  });
});
