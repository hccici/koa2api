const Router = require('koa-router')
const jwt = require('koa-jwt')
const {find,create,findById,update,deleteById,login,
	followTopics,unFollowTopics,listFollowingTopics,checkUserExist,
	follow,unFollow,listFollowing,listFollower,
	addLikingAnswer,delLikingAnswer,delDislikingAnswer,
	listLikingAnswer,addDislikingAnswer,listDislikingAnswer,listQuestions} = require('../controllers/users')
const {checkAnswerExist} = require('../controllers/answers')
const {secret} = require('../config')
const {checkTopicExit} = require('../controllers/topics')
const auth = jwt({secret})
const router = new Router({prefix: '/users'})

router.get('/',find)
router.post('/',create)
router.get('/:id',checkUserExist,findById)
router.patch('/:id',auth,update)
router.delete('/:id',deleteById)

router.post('/login',login)

router.put('/following/:id',auth,checkUserExist,follow) // 关注某个用户
router.delete('/following/:id',auth,checkUserExist,unFollow) // 取消关注某个用户
router.get('/:id/following',checkUserExist,listFollowing) // 列出某个用户的关注用户列表
router.get('/:id/follower',checkUserExist,listFollower) // 列出某个用户的粉丝用户列表

router.get('/:id/followingTopics',checkUserExist,listFollowingTopics) // 列出某个用户关注的话题
router.put('/followingTopics/:id',auth,checkTopicExit,followTopics) // 关注某个话题
router.delete('/followingTopics/:id',auth,checkTopicExit,unFollowTopics) // 取消关注某个话题

router.get('/:id/questions',checkUserExist,listQuestions) // 列出某用户提出的问题

router.put('/likingAnswers/:id',auth,checkAnswerExist,addLikingAnswer,delDislikingAnswer) // 添加 喜欢某答案，同时删除 不喜欢某答案
router.delete('/likingAnswers/:id',auth,delLikingAnswer) // 删除 喜欢某答案
router.get('/:id/likingAnswers',checkUserExist,listLikingAnswer) // 列出某用户喜欢的回答

router.put('/dislikingAnswers/:id',auth,checkAnswerExist,addDislikingAnswer,delLikingAnswer) // 添加 不喜欢某答案，同时删除 喜欢某答案
router.delete('/dislikingAnswers/:id',auth,delDislikingAnswer) // 删除 不喜欢某答案
router.get('/:id/dislikingAnswers',checkUserExist,listDislikingAnswer) // 列出某用户不喜欢的回答

module.exports = router