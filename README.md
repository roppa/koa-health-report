[![CircleCI](https://circleci.com/gh/roppa/koa-health-report.svg?style=svg)](https://circleci.com/gh/roppa/koa-health-report)

## Koa Custom Health Report Middleware

Installation:

```javascript
const healthreport = require('koa-health-report');
```

The default path is `/health`:

```javascript
app.use(healthreport());
```

With a custom path:

```javascript
app.use(healthreport({ path: '/custompath' }));
```

With a custom report object (appended):

```javascript
app.use(healthreport({ custom: {
  foo: 'bar',
  bin: () => 'baz',
} }));
```
