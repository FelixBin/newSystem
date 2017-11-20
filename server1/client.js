/*模拟node作为客户端去调用第三方的接口*/
let http=require('http');
let util=require('util')

http.get('http://www.imooc.com/u/card',function (res) {
  let data='';
  res.on("data",function (chunk) {//监听data数据的变化
    data += chunk;
  });
  res.on("end",function () {
    let result=JSON.parse(data);
    console.log(result)
    console.log("result:"+util.inspect(data));
  })
})
