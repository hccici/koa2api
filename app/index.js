const Koa = require('koa')
const koaBody = require('koa-body')// 解析body
const parameter = require('koa-parameter')// 参数校验
const error = require('koa-json-error')
const mongoose = require('mongoose')
const {mongoDBConnectionUrl} = require('./config')
const koaStatic = require('koa-static')

const path = require('path')


mongoose.connect(mongoDBConnectionUrl, { useUnifiedTopology: true,useNewUrlParser: true }, () => console.log('MongoDB 连接成功了！'))
mongoose.connection.on('error', console.error)

const routing = require('./routes')

const app = new Koa()
app.use(koaStatic(path.join(__dirname, 'public')))

app.use(error({
	postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))
app.use(koaBody({
	multipart: true,
	formidable: {
		uploadDir: path.join(__dirname, '/public/uploads'),
		keepExtensions: true,
	},
}))
app.use(parameter(app))
routing(app)

app.listen(3000, ()=> console.log('启动成功'))
