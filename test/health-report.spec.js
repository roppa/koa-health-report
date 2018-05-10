const request = require('supertest');
const healthReport = require('..');
const Koa = require('koa');

describe('Health report', () => {
  test('middleware with default path', async () => {
    const middlewareObject = healthReport();
    const ctx = { path: '/health' };
    await middlewareObject(ctx);
    const propertyNames = Object.keys(ctx.body);
    expect(propertyNames).toEqual(expect.arrayContaining([
      'timestamp',
      'uptime',
      'application',
      'resources',
      'system',
    ]));
  });

  test('middleware with custom path', async () => {
    const middlewareObject = healthReport({ path: '/custom' });
    const ctx = { path: '/custom' };
    await middlewareObject(ctx);
    const propertyNames = Object.keys(ctx.body);
    expect(propertyNames).toEqual(expect.arrayContaining([
      'timestamp',
      'uptime',
      'application',
      'resources',
      'system',
    ]));
  });

  test('middleware with custom report', async () => {
    const custom = {
      foo: 'bar',
      baz: () => 'boo',
      bin: 'bop',
    };
    const middlewareObject = healthReport({ custom });
    const ctx = { path: '/health' };
    await middlewareObject(ctx);
    const propertyNames = Object.keys(ctx.body);
    expect(propertyNames).toEqual(expect.arrayContaining([
      'timestamp',
      'uptime',
      'application',
      'resources',
      'system',
      'foo',
      'baz',
      'bin',
    ]));
    expect(ctx.body.foo).toEqual('bar');
    expect(ctx.body.baz).toEqual('boo');
    expect(ctx.body.bin).toEqual('bop');
  });

  test('middleware next', async () => {
    const middlewareObject = healthReport({ path: '/custom' });
    const ctx = {};
    const mockNext = jest.fn();
    await middlewareObject(ctx, mockNext);
    expect(mockNext).toBeCalled();
  });

  test('endpoint should return health report', async () => {
    const app = new Koa();
    app.use(healthReport());

    request(app.listen())
      .get('/health')
      .expect(200)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        const propertyNames = Object.keys(res.body);
        expect(propertyNames).toEqual(expect.arrayContaining([
          'timestamp',
          'uptime',
          'application',
          'resources',
          'system',
        ]));
      });
  });

  test('endpoint should return custom health report', async () => {
    const app = new Koa();
    const custom = {
      baz: (function baz() {
        const counter = 0;
        return () => counter + 1;
      }()),
    };
    app.use(healthReport({ custom }));

    request(app.listen())
      .get('/health')
      .expect(200)
      .end((error, res) => {
        if (error) {
          throw error;
        }
        expect(res.body.baz).toEqual(1);
      });
  });
});
