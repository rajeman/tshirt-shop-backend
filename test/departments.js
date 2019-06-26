import expect from 'expect';
import request from 'supertest';
import app from '../app';

const departmentsUrl = '/api/v1/departments';

describe('DEPARTMENT TEST SUITE', () => {
  describe('Get All Departments', () => {
    it('should return all the departments', async () => {
      const response = await request(app)
        .get(departmentsUrl)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(3);
    });

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(departmentsUrl)
        .set('Accept', 'application/json');
      expect(response.body.length).toEqual(3);
    });
  });

  describe('Get Single Department', () => {
    it('should return the specified department', async () => {
      const response = await request(app)
        .get(`${departmentsUrl}/2`)
        .set('Accept', 'application/json');
      expect(response.body.department_id).toEqual(2);
    });

    it('should return the cached response', async () => {
      const response = await request(app)
        .get(`${departmentsUrl}/2`)
        .set('Accept', 'application/json');
      expect(response.body.department_id).toEqual(2);
    });

    it('should return 404 error for a non-existing department', async () => {
      const response = await request(app)
        .get(`${departmentsUrl}/10`)
        .set('Accept', 'application/json');
      expect(response.status).toEqual(404);
    });
  });
});
