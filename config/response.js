// config/response.js - 统一 API 响应格式

const CODES = {
  SUCCESS:        0,
  PARAM_ERROR:    1001,
  NOT_FOUND:      1002,
  UNAUTHORIZED:   1003,
  FORBIDDEN:      1004,
  SERVER_ERROR:   1005,
  BUSINESS_ERROR: 1006,
}

const MESSAGES = {
  [CODES.SUCCESS]:        'success',
  [CODES.PARAM_ERROR]:    '参数错误',
  [CODES.NOT_FOUND]:      '资源不存在',
  [CODES.UNAUTHORIZED]:   '未授权',
  [CODES.FORBIDDEN]:      '禁止访问',
  [CODES.SERVER_ERROR]:   '服务器错误',
  [CODES.BUSINESS_ERROR]: '业务错误',
}

// 业务码 → HTTP 状态码映射
const HTTP_STATUS = {
  [CODES.SUCCESS]:        200,
  [CODES.PARAM_ERROR]:    400,
  [CODES.NOT_FOUND]:      404,
  [CODES.UNAUTHORIZED]:   401,
  [CODES.FORBIDDEN]:      403,
  [CODES.SERVER_ERROR]:   500,
  [CODES.BUSINESS_ERROR]: 200,
}

// 固定响应结构: { code, msg, data }
function success(ctx, data = null, msg = MESSAGES[CODES.SUCCESS]) {
  ctx.status = 200
  ctx.body = { code: CODES.SUCCESS, msg, data }
}

// 分页专用: { code, msg, data: { list, total, page, pageSize } }
function pageSuccess(ctx, list = [], total = 0, page = 1, pageSize = 10) {
  success(ctx, { list, total, page: Number(page), pageSize: Number(pageSize) })
}

function fail(ctx, code = CODES.BUSINESS_ERROR, msg = '', data = null) {
  ctx.status = HTTP_STATUS[code] || 200
  ctx.body = {
    code,
    msg: msg || MESSAGES[code] || MESSAGES[CODES.BUSINESS_ERROR],
    data,
  }
}

function paramError(ctx, msg = MESSAGES[CODES.PARAM_ERROR]) {
  fail(ctx, CODES.PARAM_ERROR, msg)
}

function notFound(ctx, msg = MESSAGES[CODES.NOT_FOUND]) {
  fail(ctx, CODES.NOT_FOUND, msg)
}

function unauthorized(ctx, msg = MESSAGES[CODES.UNAUTHORIZED]) {
  fail(ctx, CODES.UNAUTHORIZED, msg)
}

function forbidden(ctx, msg = MESSAGES[CODES.FORBIDDEN]) {
  fail(ctx, CODES.FORBIDDEN, msg)
}

function serverError(ctx, msg = MESSAGES[CODES.SERVER_ERROR]) {
  fail(ctx, CODES.SERVER_ERROR, msg)
}

function businessError(ctx, msg = MESSAGES[CODES.BUSINESS_ERROR]) {
  fail(ctx, CODES.BUSINESS_ERROR, msg)
}

/**
 * 将所有响应方法挂载到 ctx，路由中可直接使用:
 *   ctx.success(data)
 *   ctx.paramError('xxx不能为空')
 */
function mountMiddleware(ctx, next) {
  ctx.success       = (data, msg)       => success(ctx, data, msg)
  ctx.pageSuccess   = (list, total, page, pageSize) => pageSuccess(ctx, list, total, page, pageSize)
  ctx.fail          = (code, msg, data) => fail(ctx, code, msg, data)
  ctx.paramError    = (msg)             => paramError(ctx, msg)
  ctx.notFound      = (msg)             => notFound(ctx, msg)
  ctx.unauthorized  = (msg)             => unauthorized(ctx, msg)
  ctx.forbidden     = (msg)             => forbidden(ctx, msg)
  ctx.serverError   = (msg)             => serverError(ctx, msg)
  ctx.businessError = (msg)             => businessError(ctx, msg)
  return next()
}

module.exports = {
  CODES,
  MESSAGES,
  success,
  pageSuccess,
  fail,
  paramError,
  notFound,
  unauthorized,
  forbidden,
  serverError,
  businessError,
  mountMiddleware,
}
