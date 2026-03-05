

module.exports = {
  get: {
    async black (ctx, next) {
      //  tags 可以理解成借口分类  parameters 参数
      /**
       * @swagger
       * /loginaaaa:
       *   post:
       *     description: 啊啊啊啊
       *     tags: [用户登入模块]
       *     produces:
       *       - application/json
       *     parameters:
       *       - name: password
       *         description: 用户密码.
       *         in: formData
       *         required: true
       *         type: string
       *       - name: username
       *         description: 用户名.
       *         in: formData
       *         required: true
       *         type: string
       *     responses:
       *       200:
       *         description: 登入成功
       *         schema:
       *           type: object
       *           $ref: '/aa/black'
       *   
       */

      ctx.body = {'blackblackblackblackblack': ctx.query, 'b': ctx.request.body}
      console.log(ctx.query)
      console.log(ctx.request.body)
    }
  },
  post: {
    async red (ctx, next) {

  //  tags 可以理解成借口分类  parameters 参数
  /**
   * @swagger
   * /login:
   *   post:
   *     description: 用户登入
   *     tags: [用户登入模块]
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: password
   *         description: 用户密码.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: username
   *         description: 用户名.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: 登入成功
   *         schema:
   *           type: object
   *           $ref: '#/definitions/Login'
   *   
   */
      ctx.body = {'redredredredredredred': ctx.query, 'b' : ctx.request.body}
      console.log('redredredredredredred')
      console.log(ctx.query)
      console.log(ctx.request.body)
    }
  }
}