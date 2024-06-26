// tests/unit/get.test.js

const request = require('supertest');
const hash = require('../../src/hash');
const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later

  // Authenticated user with invalid expand value should give 400
  test('authenticated requests with invalid expand value should return 400 status', async () => {
    const res = await request(app)
      .get('/v1/fragments?expand=2')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(400);
  });

  // Using a valid username/password pair should give a success result with an array of expanded fragments
  test('authenticated users get an expanded fragments array', async () => {
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('testData');

    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments[0]).toHaveProperty('id');
    expect(res.body.fragments[0]).toHaveProperty('ownerId', hash('user1@email.com'));
    expect(res.body.fragments[0]).toHaveProperty('type', 'text/plain');
    expect(res.body.fragments[0]).toHaveProperty('created');
    expect(res.body.fragments[0]).toHaveProperty('size', Buffer.byteLength('testData'));
  });
});
