/*模拟服务端处理客户端的请求:拿到请求链接的pathname来读取指定 的文件*/
let http=require('http');
let url=require('url');
let util=require('util');
let fs=require('fs');

let server=http.createServer(function (req,res) {
/*  res.statusCode=200;
  res.setHeader("content-Type","text/plain;charset=utf-8");*/
  let pathname=url.parse(req.url).pathname;
    fs.readFile(pathname.substring(1),function (err,data) {
      if(err){
        res.writeHead(404,{
          'Content-Type':'text/html'
        })
      }else{
        res.writeHead(200,{
          'Content-Type':'text/html'
        })
        res.write(data.toString());
      }
      res.end();
    });
});
server.listen(3000,'127.0.0.1',()=>{
  console.log("服务器开启成功")
});
