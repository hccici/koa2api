const TopicM = require('../models/topics')
const UserM = require('../models/users')
const QuestionM = require('../models/questions')
const {util_params} = require('../utils')
const {topic: topicErrMsg} = require('../constant/errMsg')
class TopicCtl {
	async checkTopicExit(ctx,next){
		const topic = await TopicM.findById(ctx.params.id)
		if(!topic){
			ctx.throw(404,topicErrMsg['404'])
		}
		await next()
	}
	async create(ctx) {
		ctx.verifyParams({
			name: { type: 'string', required: true },
			avatar_url: { type: 'string', required: false },
			introduction: { type: 'string', select: false },
		})
		const topic = new TopicM({
			...ctx.request.body,
			avatar: ctx.state.user._id
		})
		ctx.body = await topic.save()
	}
	async find(ctx) {
		// 默认不返回创建者，可在query指定返回
		const {fields = ''} = ctx.query
		const fieldsStr = util_params.getFields(fields)
		ctx.body = await TopicM.find().select(fieldsStr)
	}
	async findById(ctx) {
		const {fields = ''} = ctx.query
		const fieldsStr = util_params.getFields(fields)
		const topic = await TopicM.findById(ctx.params.id).select(fieldsStr)
		ctx.body = topic
	}
	async update(ctx) {
		// 只有创建者才能修改
		const curAvatar = ctx.state.user._id
		const topic = await TopicM.findById(ctx.params.id).select('+avatar')
		const topicAvatar = topic.avatar
		if(curAvatar !== topicAvatar.toString()){
			ctx.throw(403,topicErrMsg['403'])
		}
		// 更新
		ctx.verifyParams({
			name: { type: 'string', required: false },
			avatar_url: { type: 'string', required: false },
			introduction: { type: 'string', required: false },
		})
		ctx.body = await TopicM.findByIdAndUpdate(ctx.params.id,ctx.request.body)
	}
	async listFollowers(ctx) {
		const user = await UserM.find({followingTopics: ctx.params.id})
		ctx.body = user
	}
	async listQuestions(ctx) {
		const qList = await QuestionM.find({topic: ctx.params.id})
		ctx.body = qList
	}
}
module.exports = new TopicCtl()