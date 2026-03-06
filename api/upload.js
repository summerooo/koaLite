const multer = require('koa-multer') //加载koa-multer模块
//文件上传
const dirPath = 'public/uploads/'
const fs = require('fs')
// const { url } = require('../dev') // dev.js no longer needed

const init = () => {
  /*
    1. fs.stat  检测是文件还是目录(目录 文件是否存在) 
    2. fs.mkdir  创建目录 （创建之前先判断是否存在） 
    3. fs.writeFile  写入文件(文件不存在就创建,但不能创建目录) 
    4. fs.appendFile 写入追加文件 
    5.fs.readFile 读取文件 
    6.fs.readdir 读取目录 
    7.fs.rename 重命名 
    8. fs.rmdir  删除目录 
    9. fs.unlink 删除文件 
  */
  fs.stat('public', (error, stats) => {
    if (error) {
      fs.mkdir('public', error =>{
        fs.mkdir('public/uploads', error =>{
          console.log('创建目录成功')
        })
      })
    }
  })
}
init()
let storage = multer.diskStorage({
  //文件保存路径
  destination: function(req, file, cb) {
    cb(null, dirPath)
  },
  //修改文件名称
  filename: function(req, file, cb) {
    let fileFormat = file.originalname.split('.')
    // cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    cb(null, file.originalname)
  }
})
let upload = multer({ storage: storage })
module.exports = {
  config: {
    saveFile: upload.single('file')
  },
  post: {
    async saveFile(ctx, next) {
      ctx.body = { filename: ctx.req.file.filename, url: `http://${url}/${ctx.req.file.path}` }
    }
  }
}
