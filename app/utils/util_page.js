function extendPagination(M,per_page = 10) {
	M.findAndPaging =  async function(ctx,...args){
		const page = ctx.query.page ? ctx.query.page - 1 : 0
		return await M.find(...args).limit(per_page).skip(per_page * page)
	}
	return M
}
module.exports = {extendPagination}