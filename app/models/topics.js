const {Schema, model} = require('mongoose')
const schema = new Schema({
	__v: { type: Number, select: false },
	name: { type: String, required: true },
	avatar_url: { type: String },
	introduction: { type: String },
	avatar: {type: Schema.Types.ObjectId,ref: 'User',select: false}
},{ timestamps: true })
module.exports = model('Topic', schema)