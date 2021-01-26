const {Schema,model} = require('mongoose')
const {util_page} = require('../utils')
const schema = new Schema({
	__v: {type: Number,select: false},
	title: {type: String,required: true},
	description: {type: String},
	questioner: {type: Schema.Types.ObjectId,ref: 'User',required: true},
	topic:{
		type: [{type: Schema.Types.ObjectId,ref: 'Topic'}]
	}
})
module.exports = util_page.extendPagination(model('Question',schema))