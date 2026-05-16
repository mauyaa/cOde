const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const assert = require('assert');
const { after, before, describe, test } = require('node:test');
const { createApp } = require('../server');

describe('Agricultural Market Platform API', () => {
  let server;
  let baseUrl;
  let tempDirectory;

  before(async () => {
    tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'marketplace-api-'));
    process.env.DATA_FILE = path.join(tempDirectory, 'store.json');
    process.env.JWT_SECRET = 'test-secret';

    const app = createApp();
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });

    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    delete process.env.DATA_FILE;
    delete process.env.JWT_SECRET;

    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }

    if (tempDirectory) {
      await fs.rm(tempDirectory, { recursive: true, force: true });
    }
  });

  test('returns seeded products from the public catalog', async () => {
    const response = await fetch(`${baseUrl}/api/products`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(Array.isArray(body.products), true);
    assert.ok(body.products.length > 0);
    assert.ok(body.products[0].seller);
  });

  test('registers a new buyer and returns a token', async () => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Grace Atieno',
        email: 'grace@example.com',
        password: 'secure123',
        role: 'buyer',
        location: 'Kisumu',
      }),
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.ok(body.token);
    assert.equal(body.user.email, 'grace@example.com');
  });

  test('lets a buyer place an order against a seeded product', async () => {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'njeri@buyer.demo',
        password: 'demo123',
      }),
    });
    const loginBody = await loginResponse.json();

    const orderResponse = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginBody.token}`,
      },
      body: JSON.stringify({
        productId: 'product_maize_01',
        quantity: 3,
        paymentMethod: 'M-Pesa',
        note: 'Need delivery before Friday.',
      }),
    });
    const orderBody = await orderResponse.json();

    assert.equal(orderResponse.status, 201);
    assert.equal(orderBody.order.status, 'pending');
    assert.equal(orderBody.order.totalAmount, 12600);
  });

  test('lets a farmer create a new product listing', async () => {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'amina@mkulima.demo',
        password: 'demo123',
      }),
    });
    const loginBody = await loginResponse.json();

    const productResponse = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginBody.token}`,
      },
      body: JSON.stringify({
        name: 'Fresh Coriander',
        category: 'Herbs',
        quantity: 40,
        unit: 'bunch',
        pricePerUnit: 25,
        location: 'Nyeri',
        description: 'Packed in same-day bundles.',
      }),
    });
    const productBody = await productResponse.json();

    assert.equal(productResponse.status, 201);
    assert.equal(productBody.product.name, 'Fresh Coriander');
    assert.equal(productBody.product.seller.fullName, 'Amina Wanjiku');
  });
});
