const os = require('os');

function generateCustom(custom) {
  return Object.keys(custom).reduce((accumulator, key) => ({
    ...accumulator,
    [key]: (typeof custom[key] === 'function') ? custom[key]() :
      custom[key],
  }), {});
}

function getCustomHealthReport(report, custom) {
  return Object.assign({}, report, generateCustom(custom));
}

function healthReport(options) {
  let path = '/health';
  let custom;

  if (options) {
    path = options.path || path;
    custom = options.custom || null;
  }

  return async function healthReportClosure(ctx, next) {
    if (ctx.path !== path) {
      return next();
    }

    const report = {
      timestamp: Date.now(),
      uptime: process.uptime(),

      application: {
        pid: process.pid,
        title: process.title,
        versions: process.versions,
        node_env: process.env.NODE_ENV,
      },

      resources: {
        memory: process.memoryUsage(),
        loadavg: os.loadavg(),
        cpu: os.cpus(),
        nics: os.networkInterfaces(),
      },

      system: {
        arch: process.arch,
        platform: process.platform,
        type: os.type(),
        release: os.release(),
        hostname: os.hostname(),
        cores: os.cpus().length,
        memory: os.totalmem(),
      },
    };

    ctx.body = (custom) ? getCustomHealthReport(report, custom) : report;
    return ctx;
  };
}

module.exports = healthReport;
