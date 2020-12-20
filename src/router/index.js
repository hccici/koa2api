
const fs=require('fs')
const path=require('path')
function render(view){
    return new Promise((resolve,reject)=>{
        let html=path.resolve(__dirname,`view${view}.html`)
        console.log(html)
        fs.readFile(html,'binary',(err,data)=>{
            if(err){
                reject(err)
            }
            resolve(data)
        })
    })
}

// 异步获取页面
async function router(ctx,next){
    let url=ctx.url
    ctx.body=await render(url)
    next()
    
}
module.exports=router