const fs = require('fs')
const utils = {}
fs.readdirSync(__dirname).forEach(file=>{
	if(file === 'index.js'){return}
	const fileName = file.split('.')[0]
	utils[fileName] = require('./'+file)
})
module.exports = utils