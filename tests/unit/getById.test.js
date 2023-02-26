const request = require('supertest');
const hash = require('../../src/hash');
const app = require('../../src/app');
describe('GET /v1/fragments:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));
});

describe('GET /v1/fragments:id/info', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/id/info').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/id/info')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('authenticated users get an expanded fragments array', async () => {
    const res1 = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('testData');
    let id1 = res1.body.fragment.id;
    expect(id1).toEqual('123');
    const res = await request(app)
      .get(`/v1/fragments${id1}/info`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');

    expect(res.body.fragment).toHaveProperty('id');
    expect(res.body.fragment).toHaveProperty('ownerId', hash('user1@email.com'));
    expect(res.body.fragment).toHaveProperty('type', 'text/plain');
    expect(res.body.fragment).toHaveProperty('created');
    expect(res.body.fragment).toHaveProperty('size', Buffer.byteLength('testData'));
  });
});
