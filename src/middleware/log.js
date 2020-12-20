function log(ctx) {
    console.log(new Date() + '_' + ctx)
}
module.exports = function () {
    return async function (ctx, next) {
        log(ctx)
        await next()
        console.log('又回来了')
    }
}
