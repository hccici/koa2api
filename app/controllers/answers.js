const M = require('../models/answers')
const {answer: errMsg} = require('../constant/errMsg')
class AnswersCtl {
	async find(ctx) {
		const q = new RegExp(ctx.query.q)
		ctx.body = await M
			.findAndPaging(ctx,{ content: q, questionId: ctx.params.questionId })
	}
	async checkAnswerExist(ctx, next) {
		const answer = await M.findById(ctx.params.id).select('+answerer')
		if (!answer) { ctx.throw(404, errMsg['404']) }
		// 检查该回答的所属问题是否是传过来的
		// !只有删改查答案时候检查此逻辑，赞、踩答案时候不检查
		if (ctx.params.questionId && ctx.params.questionId !== answer.questionId) {
			ctx.throw(404, errMsg['404-1'])
		}
		ctx.state.answer = answer
		await next()
	}
	async findById(ctx) {
		const answer = await M.findById(ctx.params.id).populate('answerer')
		ctx.body = answer
	}
	async create(ctx) {
		ctx.verifyParams({
			content: { type: 'string', required: true },
		})
		const answerer = ctx.state.user._id
		const { questionId } = ctx.params
		const answer = await new M({ ...ctx.request.body, answerer, questionId }).save()
		ctx.body = answer
	}
	async checkAnswerer(ctx, next) {
		const { answer } = ctx.state
		if (answer.answerer.toString() !== ctx.state.user._id) { ctx.throw(403, errMsg['403']) }
		await next()
	}
	async update(ctx) {
		ctx.verifyParams({
			content: { type: 'string', required: false },
		})
		await ctx.state.answer.update(ctx.request.body)
		ctx.body = ctx.state.answer
	}
	async delete(ctx) {
		await M.findByIdAndRemove(ctx.params.id)
		ctx.status = 204
	}
}

module.exports = new AnswersCtl()