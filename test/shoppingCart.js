import expect from 'expect';
import request from 'supertest';
import app from '../app';

const shoppingCartUrl = '/api/v1/shoppingCart';

describe('SHOPPING CART TEST SUITE', () => {
  describe('Generate UniqueId', () => {
    it('should return a uniqueId', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/generateUniqueId`)
        .set('Accept', 'application/json');
      expect(response.body.cart_id).toBeTruthy();
    });
  });

  describe('Add Product to Cart', () => {
    it('should not accept requests with missing field', async () => {
      const response = await request(app)
        .post(`${shoppingCartUrl}/add`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual('The cart_id field is required');
    });

    it('should not accept requests with cart_id less than 3 chars', async () => {
      const response = await request(app)
        .post(`${shoppingCartUrl}/add`)
        .set('Accept', 'application/json')
        .send({ cart_id: 'ab', attributes: 'black', product_id: 2 });
      expect(response.body.message).toEqual(
        'cart_id must be within 3 and 25 characters'
      );
    });

    it('should not accept requests with attributes less than 3 chars', async () => {
      const response = await request(app)
        .post(`${shoppingCartUrl}/add`)
        .set('Accept', 'application/json')
        .send({ cart_id: 'abc', attributes: 'bl', product_id: 2 });
      expect(response.body.message).toEqual(
        'attributes must be within 3 and 900 characters'
      );
    });

    it('should add product to cart with valid fields', async () => {
      const response = await request(app)
        .post(`${shoppingCartUrl}/add`)
        .set('Accept', 'application/json')
        .send({ cart_id: 'zx-18-2d', attributes: 'black', product_id: 2 });
      expect(response.body[0].product_id).toEqual(2);
    });

    it('should not add same product to same cart twice', async () => {
      const response = await request(app)
        .post(`${shoppingCartUrl}/add`)
        .set('Accept', 'application/json')
        .send({ cart_id: 'zx-18-2d', attributes: 'black', product_id: 2 });
      expect(response.body.message).toEqual('product already in cart');
    });
  });

  describe('Get Items In Cart', () => {
    it('should return all cart items with supplied cart_id', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/zx-18-2d`)
        .set('Accept', 'application/json');
      expect(response.body[0].product_id).toEqual(2);
    });
  });

  describe('Update Item In Cart', () => {
    it('should update the item in cart', async () => {
      const response = await request(app)
        .put(`${shoppingCartUrl}/update/1`)
        .set('Accept', 'application/json')
        .send({ quantity: 10 });
      expect(response.body[0].quantity).toEqual(10);
    });

    it('should not update item if quantity is not supplied', async () => {
      const response = await request(app)
        .put(`${shoppingCartUrl}/update/1`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual('The quantity field is required');
    });

    it('should not update item if quantity is not a positive integer', async () => {
      const response = await request(app)
        .put(`${shoppingCartUrl}/update/1`)
        .set('Accept', 'application/json')
        .send({ quantity: 'e' });
      expect(response.body.message).toEqual(
        'quantity must be a positive integer within 1 and 1000000'
      );
    });

    it('should not accept request for non-existent item', async () => {
      const response = await request(app)
        .put(`${shoppingCartUrl}/update/100`)
        .set('Accept', 'application/json')
        .send({ quantity: 10 });
      expect(response.body.message).toEqual(
        'item with supplied id does not exist'
      );
    });
  });

  describe('Get Total Amount of Items in Cart', () => {
    it('should get the total amount of items in cart', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/totalAmount/zx-18-2d`)
        .set('Accept', 'application/json');
      expect(response.body.total_amount).toEqual(10);
    });
  });

  describe('Save An Item For Later', () => {
    it('should save the item for later', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/saveForLater/1`)
        .set('Accept', 'application/json');
      expect(response.body).toEqual({});
    });

    it('should not accept request with non-existing item id', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/saveForLater/10`)
        .set('Accept', 'application/json');
      expect(response.body.message).toEqual(
        'item with supplied id does not exist'
      );
    });
  });

  describe('Get Saved Items', () => {
    it('should return the saved items in supplied cart', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/getSaved/zx-18-2d`)
        .set('Accept', 'application/json');
      expect(response.body[0].product_id).toEqual(2);
    });
  });

  describe('Move Item To Cart', () => {
    it('should move the item to cart', async () => {
      const response = await request(app)
        .get(`${shoppingCartUrl}/movetocart/1`)
        .set('Accept', 'application/json');
      expect(response.body).toEqual({});
    });
  });

  describe('Delete Items From Cart', () => {
    it('should delete the item with the supplied item_id', async () => {
      const response = await request(app)
        .delete(`${shoppingCartUrl}/removeProduct/1`)
        .set('Accept', 'application/json');
      expect(response.body).toEqual({});
    });

    it('should delete the item(s) with the supplied cartId', async () => {
      const response = await request(app)
        .delete(`${shoppingCartUrl}/empty/zx-18-2d`)
        .set('Accept', 'application/json');
      expect(response.body).toEqual([]);
    });
  });
});
