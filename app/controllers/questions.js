
const M = require('../models/questions')
const {question: errMsg} = require('../constant/errMsg')
class Ctl{
	async checkQuestionExit(ctx,next){
		const question =  await M.findById(ctx.params.id)
		if(!question){
			ctx.throw(404,errMsg['404'])
		}
		ctx.state.question = question
		await next()
	}
	async create(ctx){
		ctx.verifyParams({
			title: { type: 'string', required: true },
			description: { type: 'string', required: true },
			topic: {type: 'array', itemType: 'string',max: 2,required: false}
		})
		const question = await new M({...ctx.request.body, questioner: ctx.state.user._id}).save()
		ctx.body = question
	}
	async find(ctx){
		const questions = await M.findAndPaging(ctx)
		ctx.body = questions
	}
	async findById(ctx){
		ctx.body = ctx.state.question
	}
	async update(ctx){
		ctx.verifyParams({
			title: { type: 'string',required: false },
			description: { type: 'string',required: false },
			topic: {type: 'array', itemType: 'string',max: 2,required: false}
		})
		// 是否是创建者
		if(ctx.state.user._id !== ctx.state.question.questioner.toString()){
			ctx.throw(403,errMsg['403'])
		}
		await ctx.state.question.update(ctx.request.body)
		ctx.body = ctx.state.question
	}
	async deleteOne(ctx){
		// 是否是创建者
		if(ctx.state.user._id !== ctx.state.question.questioner.toString()){
			ctx.throw(403,errMsg['403'])
		}
		ctx.body = await ctx.state.question.deleteOne()
	}
}
module.exports = new Ctl()