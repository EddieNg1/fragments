const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/id').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments/id')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  test('invalid id returns 404', () =>
    request(app)
      .delete('/v1/fragments/invalid_id')
      .auth('user1@email.com', 'password1')
      .expect(404));

  test('successful delete returns 200', async () => {
    request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('fragment data')
      .expect(201)
      .then((req) => {
        const body = JSON.parse(req.text);
        const id = body.fragment.id;
        return request(app)
          .delete(`/v1/fragments/${id}`)
          .auth('user1@email.com', 'password1')
          .expect(200);
      });
  });

  //   const res2 = await request(app)
  //     .delete(`/v1/fragments/${id}`)
  //     .auth('user1@email.com', 'password1');
  //   expect(res2.statusCode).toBe(404);
  // });
});
