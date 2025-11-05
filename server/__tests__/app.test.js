const request = require('supertest');
const app = require('../app');

describe('Server basic endpoints', () => {
  test('GET /ping returns pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'pong');
  });

  test('POST /snippets creates a new snippet', async () => {
    const payload = { html: '<h1>Test</h1>', css: 'body{}', js: 'console.log(1);', title: 'test' };
    const res = await request(app).post('/snippets').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('html', payload.html);
    expect(res.body).toHaveProperty('css', payload.css);
    expect(res.body).toHaveProperty('js', payload.js);
  });
});
