const multer = require('koa-multer');
const fs = require('fs');
const env = require('../config/env');
const response = require('../config/response');

const dirPath = 'public/uploads/';

const init = () => {
  fs.stat('public', (error) => {
    if (error) {
      fs.mkdir('public', () => {
        fs.mkdir('public/uploads', () => {
          console.log('创建目录成功');
        });
      });
    }
  });
};
init();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dirPath),
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

module.exports = {
  config: {
    saveFile: upload.single('file'),
  },
  post: {
    /**
     * @swagger
     * /upload/saveFile:
     *   post:
     *     summary: 文件上传
     *     tags: [文件上传]
     *     consumes:
     *       - multipart/form-data
     *     parameters:
     *       - name: file
     *         in: formData
     *         description: 上传的文件
     *         required: true
     *         type: file
     *     responses:
     *       200:
     *         description: 上传成功
     */
    async saveFile(ctx) {
      const file = ctx.req.file;
      if (!file) return response.paramError(ctx, '请选择上传文件');
      const url = `http://${env.HOST}:${env.PORT}/${file.path}`;
      response.success(ctx, { filename: file.filename, url }, '上传成功');
    },
  },
};
