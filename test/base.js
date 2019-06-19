import expect from 'expect';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import models from '../models';
import app from '../app';

describe('BASE URL TEST', () => {
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
});
