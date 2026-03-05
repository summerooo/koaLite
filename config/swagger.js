const Router = require('koa-router'); const router = new Router(); // 引入路由函数并实例化
const swaggerJSDoc = require('swagger-jsdoc')
const path = require('path')

const options = {
  swaggerDefinition: {
    info: {
      title: '接口',
      version: '1.0.0',
      description: 'API',
    },
    // host: 'localhost:1116',
    basePath: '/' // Base path (optional)
  },
  apis: [path.join(__dirname, '../api/*.js')], // <-- not in the definition, but in the options
};


router.get('/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json')
  ctx.body = swaggerJSDoc(options)
})

module.exports = router
//将页面暴露出去
