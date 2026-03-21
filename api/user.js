const response = require('../config/response');

/**
 * @swagger
 * tags:
 *   - name: 用户模块
 *     description: 用户注册、登录、增删改查
 */

module.exports = {
  get: {
    /**
     * @swagger
     * /user/list:
     *   get:
     *     summary: 获取用户列表
     *     tags: [用户模块]
     *     parameters:
     *       - name: page
     *         in: query
     *         description: 页码（默认1）
     *         required: false
     *         type: integer
     *       - name: pageSize
     *         in: query
     *         description: 每页数量（默认10）
     *         required: false
     *         type: integer
     *     responses:
     *       200:
     *         description: 成功返回用户列表
     */
    async list(ctx) {
      const { page = 1, pageSize = 10 } = ctx.query;
      // 示例数据，实际项目替换为数据库查询
      const list = [
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'user',  createdAt: '2024-02-01' },
        { id: 3, username: 'user2', email: 'user2@example.com', role: 'user',  createdAt: '2024-03-01' },
      ];
      response.pageSuccess(ctx, list, list.length, page, pageSize);
    },

    /**
     * @swagger
     * /user/detail:
     *   get:
     *     summary: 获取用户详情
     *     tags: [用户模块]
     *     parameters:
     *       - name: id
     *         in: query
     *         description: 用户 ID
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: 成功返回用户详情
     */
    async detail(ctx) {
      const { id } = ctx.query;
      if (!id) return response.paramError(ctx, '用户ID不能为空');
      // 示例数据，实际项目替换为数据库查询
      const user = { id: Number(id), username: 'admin', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-01' };
      response.success(ctx, user);
    },
  },

  post: {
    /**
     * @swagger
     * /user/register:
     *   post:
     *     summary: 用户注册
     *     tags: [用户模块]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         in: formData
     *         description: 用户名
     *         required: true
     *         type: string
     *       - name: password
     *         in: formData
     *         description: 密码
     *         required: true
     *         type: string
     *       - name: email
     *         in: formData
     *         description: 邮箱
     *         required: false
     *         type: string
     *     responses:
     *       200:
     *         description: 注册成功
     */
    async register(ctx) {
      const { username, password, email } = ctx.request.body;
      if (!username || !password) return response.paramError(ctx, '用户名和密码不能为空');
      // 示例，实际项目需校验用户名是否已存在并写入数据库
      response.success(ctx, { id: Date.now(), username, email: email || '', role: 'user' }, '注册成功');
    },

    /**
     * @swagger
     * /user/login:
     *   post:
     *     summary: 用户登录
     *     tags: [用户模块]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: username
     *         in: formData
     *         description: 用户名
     *         required: true
     *         type: string
     *       - name: password
     *         in: formData
     *         description: 密码
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: 登录成功，返回 token
     */
    async login(ctx) {
      const { username, password } = ctx.request.body;
      if (!username || !password) return response.paramError(ctx, '用户名和密码不能为空');
      // 示例，实际项目需查询数据库并验证密码（bcrypt）
      if (username === 'admin' && password === '123456') {
        response.success(ctx, { token: 'mock_token_' + Date.now(), username, role: 'admin' }, '登录成功');
      } else {
        response.unauthorized(ctx, '用户名或密码错误');
      }
    },

    /**
     * @swagger
     * /user/update:
     *   post:
     *     summary: 更新用户信息
     *     tags: [用户模块]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: formData
     *         description: 用户 ID
     *         required: true
     *         type: integer
     *       - name: email
     *         in: formData
     *         description: 新邮箱
     *         required: false
     *         type: string
     *       - name: role
     *         in: formData
     *         description: 角色（user / admin）
     *         required: false
     *         type: string
     *     responses:
     *       200:
     *         description: 更新成功
     */
    async update(ctx) {
      const { id, email, role } = ctx.request.body;
      if (!id) return response.paramError(ctx, '用户ID不能为空');
      // 示例，实际项目需更新数据库对应记录
      response.success(ctx, { id: Number(id), email, role }, '更新成功');
    },

    /**
     * @swagger
     * /user/delete:
     *   post:
     *     summary: 删除用户
     *     tags: [用户模块]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: formData
     *         description: 用户 ID
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: 删除成功
     */
    async delete(ctx) {
      const { id } = ctx.request.body;
      if (!id) return response.paramError(ctx, '用户ID不能为空');
      // 示例，实际项目需从数据库删除对应记录
      response.success(ctx, null, '删除成功');
    },
  },
};
