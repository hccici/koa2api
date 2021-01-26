class Params {
	getFields(fields) {
		return fields.split(';').filter(f=>f).map(m=>` +${m}`).join('')
	}
}
module.exports = new Params()