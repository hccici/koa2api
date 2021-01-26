const Router = require('koa-router')
const router = new Router({prefix: '/topics'})
const {create, find, checkTopicExit, findById, update,listFollowers,listQuestions} = require('../controllers/topics')
const jwt = require('koa-jwt')
const {secret} = require('../config')
const auth = jwt({secret})// jwt的auth 会把解密后的东西放当ctx.state里

router.post('/',auth,create)
router.get('/', find)
router.get('/:id',checkTopicExit,findById)
router.patch('/:id',checkTopicExit,auth,update)

router.get('/:id/followers',checkTopicExit,listFollowers)
router.get('/:id/questions',checkTopicExit,listQuestions)
module.exports = router