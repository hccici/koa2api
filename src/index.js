const Koa = require('koa')
const app = new Koa()
// const log = require('./middleware/log')// demo中间件
// const router = require('./router/index')// demo路由
const KoaRouter = require('koa-router')
// app.use(log())
// // app.use(router)
const router=new KoaRouter()
const util=require('./util')
router.get('/', (ctx, next) => {
    let html = `
      <h1>koa2 request post demo</h1>
      <form method="POST" action="/result">
        <p>userName</p>
        <input name="userName" /><br/>
        <p>nickName</p>
        <input name="nickName" /><br/>
        <p>email</p>
        <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
    ctx.body=html
    next()
});
router.post('/result',async (ctx,next)=>{
    let parsePostData=util.parsePostData
    let postData = await parsePostData( ctx )
    ctx.body = postData
    next()
})
//! 二级路由
const user=new KoaRouter()
user.get('/auth',(ctx,next)=>{
    ctx.body='auth'
    next()
})
user.get('/',(ctx,next)=>{
    ctx.body='user index'
    next()
})
router.use('/user',user.routes(),user.allowedMethods())

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000)
console.log('start at 3000')