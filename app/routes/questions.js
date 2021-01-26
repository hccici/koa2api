const Router = require('koa-router')
const router = new Router({prefix: '/questions'})
const jwt = require('koa-jwt')
const {secret} = require('../config')
const auth = jwt({secret: secret})
const {checkQuestionExit, create, findById, find, update, deleteOne} = require('../controllers/questions')
router.get('/',find)
router.post('/',auth,create)
router.get('/:id',checkQuestionExit,findById)
router.patch('/:id',checkQuestionExit,auth,update)
router.delete('/:id',checkQuestionExit,auth,deleteOne)

module.exports = router