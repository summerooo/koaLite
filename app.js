const env = require('./config/env');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const rateLimit = require('koa-ratelimit');
const compress = require('koa-compress');
const staticServer = require('koa-static');
const Router = require('koa-router');
const path = require('path');
const relativeRouter = require('./config/router');
const logger = require('./config/logger');
const { mountMiddleware } = require('./config/response');

const { HOST: url, PORT: port, LOCAL_IP: localIP } = env;

const app = new Koa();
const router = new Router();

// http 请求解析（保持兼容）
app.use(bodyParser());
// 将 response 方法挂载到 ctx（ctx.success / ctx.paramError 等）
app.use(mountMiddleware);
// 日志
app.use(logger);

// 安全中间件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));
app.use(rateLimit({
  driver: 'memory',
  db: new Map(),
  duration: 60000,
  errorMessage: 'Too many requests, please try again later.',
  max: 100,
  whitelist: () => false,
}));
app.use(compress());

// CORS 配置
app.use(cors({
  origin: (ctx) => {
    if (ctx.url === '/test') return '*';
    return env.isProd ? env.CORS_ORIGIN_PROD : env.CORS_ORIGIN_DEV;
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control', 'multipart/form-data'],
}));

if (!env.isProd) {
  // swagger (development only)
  const koaSwagger = require('koa2-swagger-ui').koaSwagger;
  const swagger = require('./config/swagger');
  app.use(swagger.routes(), swagger.allowedMethods());
  app.use(koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
      url: '/swagger.json',
    },
  }));
}

// 设置服务目录
app.use(staticServer(path.join(__dirname)));
// 自动匹配status
app.use(router.routes());
app.use(router.allowedMethods());
// 设置接口
app.use(relativeRouter(__dirname));

// Start server with fallback if port is already in use
const startServer = (listenPort) => {
  const server = app.listen(listenPort, url);
  server.on('listening', () => {
    console.log(`Server listening at http://${localIP}:${listenPort}`);
    if (!env.isProd) {
      console.log(`Swagger UI: http://${localIP}:${listenPort}/swagger`);
    }
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${listenPort} already in use, trying next port...`);
      startServer(listenPort + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(port);
