const request = require('supertest');
const app = require('../../src/app');
const hash = require('../../src/hash');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result
  test('authenticated users can create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('testData');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('responses include a Location header', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('testData');
    expect(res.headers['location']).toBe(
      `http://localhost:8080/v1/fragments/${res.body.fragment.id}`
    );
  });

  test('trying to create a fragment with an unsupported type is denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send('testData');
    expect(res.status).toEqual(500);
  });

  test('Reponses include all necessary and expected properties', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('testData');

    // expect(res.body.fragment).toHaveProperty('id');
    // expect(res.body.fragment).toHaveProperty('ownerId', hash('user1email.com'));
    // expect(res.body.fragment).toHaveProperty('type', 'text/plain');
    // expect(res.body.fragment).toHaveProperty('created');
    // expect(res.body.fragment).toHaveProperty('size', Buffer.byteLength('testData'));
    expect(res.body.fragment).objectContaining({
      id: expect.not.toBeNull(),
      ownerId: hash('user1email.com'),
    });
  });
});
