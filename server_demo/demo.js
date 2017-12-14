let user=require('./User');
console.log(`I am userName:${user.userName}`);
console.log(`I say sayHello:${user.sayHello()}`);
let http=require('http');
let url=require('url');
let util=require('util');

let server=http.createServer(function (req,res) {
  res.statusCode=200;
  res.setHeader("content-Type","text/plain;charset=utf-8");


  res.end(util.inspect(url.parse(req.url)));
});
server.listen(3000,'127.0.0.1',()=>{
  console.log("服务器开启成功")
});

