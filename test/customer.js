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
          email: `habib7019${'a'.repeat(30)}@gmail.com`,
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

  describe('Update Customer Address', () => {
    it('should update a customer with valid required details', async () => {
      const response = await request(app)
        .put(`${customersUrl}/address`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          city: 'Paris',
          region: 'Pacific',
          country: 'France',
          address_1: 'simpson street',
          postal_code: '0231',
          shipping_region_id: 1,
          address_2: 'Liam street Hajoue'
        });
      expect(response.body.postal_code).toEqual('0231');
    });

    it('should not update a customer with missing required field', async () => {
      const response = await request(app)
        .put(`${customersUrl}/address`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          region: 'Pacific',
          country: 'France',
          address_1: 'simpson street',
          postal_code: '0231',
          shipping_region_id: 1,
          address_2: 'Liam street Hajoue'
        });
      expect(response.body.message).toEqual('The city field is required');
    });

    it('should accept request with non-existent shipping region', async () => {
      const response = await request(app)
        .put(`${customersUrl}/address`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          city: 'Paris',
          region: 'Pacific',
          country: 'France',
          address_1: 'simpson street',
          postal_code: '0231',
          shipping_region_id: 10,
          address_2: 'Liam street Hajoue'
        });
      expect(response.body.message).toEqual(
        'shipping region with supplied id does not exist'
      );
    });

    it('should accept request with city region than 3 characters', async () => {
      const response = await request(app)
        .put(`${customersUrl}/address`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({
          city: 'Paris',
          region: 'AB',
          country: 'France',
          address_1: 'simpson street',
          postal_code: '0231',
          shipping_region_id: 10,
          address_2: 'Liam street Hajoue'
        });
      expect(response.body.message).toEqual(
        'region must be within 3 and 90 non-whitespace characters'
      );
    });
  });

  describe('Update Credit Card', () => {
    it('should update with a valid credit card number', async () => {
      const response = await request(app)
        .put(`${customersUrl}/creditCard`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({ credit_card: '5500 0000 0000 0004' });
      expect(response.body.credit_card).toEqual('******0004');
    });

    it('should not update with an invalid credit card number', async () => {
      const response = await request(app)
        .put(`${customersUrl}/creditCard`)
        .set('Accept', 'application/json')
        .set('user-key', user.token)
        .send({ credit_card: '550099909090901' });
      expect(response.body.message).toEqual('this is an invalid Credit Card');
    });

    it('should accept request with missing credit_card param', async () => {
      const response = await request(app)
        .put(`${customersUrl}/creditCard`)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body.message).toEqual(
        'The credit_card field is required'
      );
    });
  });

  describe('Get Customer', () => {
    it('should return the authorized customer', async () => {
      const response = await request(app)
        .get(customersUrl)
        .set('Accept', 'application/json')
        .set('user-key', user.token);
      expect(response.body.name).toEqual('Habib');
    });
  });
});
