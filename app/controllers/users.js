const M = require('../models/users')
const Question = require('../models/questions')
const Answer = require('../models/answers')
const {user: userErrMsg}=require('../constant/errMsg')
const { secret } = require('../config')
const jsonwebtoken = require('jsonwebtoken')
const {util_params} = require('../utils')
class UserCtl {
	async checkUserExist(ctx,next){
		const user = await M.findById(ctx.params.id)
		if(!user){
			ctx.throw(404,userErrMsg['404'])
		}
		ctx.state.my_user = user
		await next()
	}
	async find(ctx){
		const {fields= ''} = ctx.query
		const fieldsStr = util_params.getFields(fields)
		const uL = await M.find().select(fieldsStr)
		ctx.body = uL
	}
	async findById(ctx){
		ctx.body = ctx.state.my_user
	}
	async create(ctx){
		ctx.verifyParams({
			name: {type: 'string',required: true}
		})
		const {name} = ctx.request.body
		const repeateUser = await M.findOne({name})
		if(repeateUser){
			ctx.throw(409,userErrMsg['409'])
		}
		const nU = await new M(ctx.request.body).save()
		ctx.body = {
			message: '创建成功',
			data: nU
		}
	}
	async update(ctx){
		ctx.verifyParams({
			name: {type: 'string',required: true}
		})
		const user = await M.findByIdAndUpdate(ctx.params.id, ctx.request.body)
		if (!user) { ctx.throw(404, '用户不存在') }
		ctx.body = user
	}
	async deleteById(ctx){
		const user = await M.findByIdAndRemove(ctx.params.id)
		if (!user) { ctx.throw(404, '用户不存在') }
		ctx.status = 204
	}
	async login(ctx){
		ctx.verifyParams({
			name: { type: 'string', required: true },
			password: { type: 'string', required: true }
		})
		const user = await M.findOne(ctx.request.body)
		if (!user) { ctx.throw(401, '用户名或密码不正确') }
		const { _id, name } = user
		const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })// 加密id，以便后续解密后使用
		ctx.body = { token }
	}
	async followTopics(ctx){
		const me = await M.findById(ctx.state.user._id).select('+followingTopics')
		// 是否已经关注过了
		const isFollowing = me.followingTopics.map(id=>id.toString()).includes(ctx.params.id)
		if(!isFollowing){
			me.followingTopics.push(ctx.params.id)
			await me.save()
		}
		ctx.status = 204
	}
	async unFollowTopics(ctx){
		const me = await M.findById(ctx.state.user._id).select('+followingTopics')
		const index = me.followingTopics.map(id=>id.toString()).indexOf(ctx.params.id)
		if(index>-1){
			me.followingTopics.splice(index,1)
			me.save()
		}
		ctx.status = 204
	}
	async listFollowingTopics(ctx) {
		const user = await M.findById(ctx.params.id).populate('followingTopics')
		ctx.body = user.followingTopics
	}
	async checkAuth(ctx,next){
		const self = ctx.state.user
		if(ctx.params.id !== self._id){
			ctx.throw(403,userErrMsg['403'])
		}
		await next()
	}
	async unFollow(ctx){
		const me = await M.findById(ctx.state.user._id).select('+following')
		const index = me.following.map(item=>item.toString()).indexOf(ctx.params.id)
		if(index > -1){
			me.following.splice(index,1)
			await me.save()
			ctx.status = 204
		}else{
			ctx.status = 204
		}
	}
	async follow(ctx){
		// 不能关注自己
		if(ctx.params.id === ctx.state.user._id){
			ctx.throw(403,userErrMsg['403-1'])
		}
		// 首先查看是否关注过，没有就添加
		const me = await M.findById(ctx.state.user._id).select('+following')
		if(!me.following.map(item=>item.toString()).includes(ctx.params.id)){
			me.following.push(ctx.params.id)
			await me.save()
			ctx.status = 204
		}else{
			ctx.status = 204
		}
	}
	async listFollowing(ctx){
		const me = await M.findById(ctx.params.id).populate('following')
		if(!me){
			ctx.throw(404,userErrMsg['404'])
		}
		ctx.body = me.following
	}
	async listFollower(ctx){
		const list = await M.find({following: ctx.params.id})
		ctx.body = list
	}
	async listQuestions(ctx) {
		const questions = await Question.find({ questioner: ctx.params.id })
		ctx.body = questions
	}
	async addLikingAnswer(ctx,next){
		const me = await M.findById(ctx.state.user._id).select('+likingAnswers')
		if(!me.likingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
			me.likingAnswers.push(ctx.params.id)
			await me.save()
			// 同时修改该答案的喜欢次数
			await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { likeCount: 1 } })
		}
		ctx.status = 204
		await next()
	}
	async delLikingAnswer(ctx,next){
		const me = await M.findById(ctx.state.user._id).select('+likingAnswers')
		const index = me.likingAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
		if(index>-1){
			me.likingAnswers.splice(index,1)
			await me.save()
			// 同时修改该答案的喜欢次数
			await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { likeCount: -1 } })
		}
		ctx.status = 204
		await next()
	}
	async listLikingAnswer(ctx){
		const me = await M.findById(ctx.params.id).populate('likingAnswers')
		ctx.body = me.likingAnswers
	}
	async addDislikingAnswer(ctx,next){
		const me = await M.findById(ctx.state.user._id).select('+dislikingAnswers')
		if(!me.dislikingAnswers.map(id=>id.toString()).includes(ctx.params.id)){
			me.dislikingAnswers.push(ctx.params.id)
			await me.save()
			// 同时修改该答案的喜欢次数
			await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { unlikeCount: 1 } })
		}
		ctx.status = 204
		await next()
	}
	async delDislikingAnswer(ctx,next){
		const me = await M.findById(ctx.state.user._id).select('+dislikingAnswers')
		const index = me.dislikingAnswers.map(id=>id.toString()).indexOf(ctx.params.id)
		if(index>-1){
			me.dislikingAnswers.splice(index,1)
			await me.save()
			// 同时修改该答案的喜欢次数
			await Answer.findByIdAndUpdate(ctx.params.id, { $inc: { unlikeCount: -1 } })
		}
		ctx.status = 204
		await next()
	}
	async listDislikingAnswer(ctx){
		const me = await M.findById(ctx.params.id).populate('dislikingAnswers')
		ctx.body = me.dislikingAnswers
	}
}
module.exports = new UserCtl()