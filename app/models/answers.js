const { Schema, model } = require('mongoose')
const {util_page} = require('../utils')
const answerSchema = new Schema({
	__v: { type: Number, select: false },
	content: { type: String, required: true },
	answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
	questionId: { type: String, required: true },
	likeCount: { type: Number, default: 0 },
	unlikeCount: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = util_page.extendPagination(model('Answer', answerSchema))