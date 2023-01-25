const request = require('supertest');

const app = require('../../src/app');

describe('Resource not found', () => {
  // Requests for resources that can't be found should give 404 status and error response
  test('should return 404 status, message, and code in response', async () => {
    const res = await request(app).get('/notfound');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.body.error.message).toEqual('not found');
    expect(res.body.error.code).toEqual(404);
  });
});
