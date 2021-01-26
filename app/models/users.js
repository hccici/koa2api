const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
	__v: {type: Number,select: false},
	name: {type: String,required: true},
	password: {type: String,required: true,select: false},
	followingTopics:{
		type: [{type: Schema.Types.ObjectId, ref: 'Topic'}],
		select: false
	},
	following: {
		type: [{type: Schema.Types.ObjectId, ref: 'User'}],
		select: false
	},
	likingAnswers: {
		type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
		select: false,
	},
	dislikingAnswers: {
		type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
		select: false,
	}
})

module.exports = model('User',userSchema)