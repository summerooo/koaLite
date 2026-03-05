// logger.js - 使用 pino 统一记录请求和错误日志
const path = require('path')
const pino = require('pino')

// 日志目录（位于 public/logs）
const logsDir = path.join(__dirname, '../public/logs')

// 确保日志目录存在
const fs = require('fs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
  console.log('创建日志目录成功:', logsDir)
}

/**
 * 根据当前日期创建 pino 的目标文件流，日志文件名形如 2023-08-31.log
 */
function createPinoDestination() {
  const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const filePath = path.join(logsDir, `${date}.log`)
  // pino.destination 默认是非同步写入，性能更好
  return pino.destination({ dest: filePath, sync: false })
}

// 创建 pino 实例（可在整个项目中复用）
const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: null, // 去掉 pid, hostname 等默认字段，保持日志简洁
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  createPinoDestination()
)

/**
 * Koa 中间件 - 记录请求、响应、错误以及耗时
 * 使用 pino 统一打印到控制台并写入日常日志文件（每天一个文件）
 */
module.exports = async (ctx, next) => {
  const start = Date.now()
  const { method, url, host } = ctx.request

  try {
    await next()
    const ms = Date.now() - start

    // 请求信息（已由 bodyParser 处理）
    const query = ctx.query || {}
    const requestBody = ctx.request.body || {}

    // 响应信息
    const responseBody = typeof ctx.body === 'object' ? ctx.body : String(ctx.body || '')

    const userInfo = ctx.state.user
      ? { id: ctx.state.user.id, username: ctx.state.user.username }
      : null

    // 使用结构化日志，便于后期分析与搜索
    logger.info({
      host,
      method,
      url,
      query,
      requestBody,
      responseBody,
      status: ctx.status,
      duration: ms,
      user: userInfo,
    }, 'request')
  } catch (err) {
    const ms = Date.now() - start
    const query = ctx.query || {}
    const requestBody = ctx.request.body || {}

    logger.error({
      host,
      method,
      url,
      query,
      requestBody,
      status: err.status || 500,
      duration: ms,
      errorMessage: err.message,
      stack: err.stack,
    }, 'error')

    ctx.status = err.status || 500
    ctx.body = {
      msg: err.message || '系统错误',
      code: ctx.status,
    }
  }
}

