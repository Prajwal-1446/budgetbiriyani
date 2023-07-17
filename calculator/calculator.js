const express = require('express');
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(request,response){
    response.sendFile(__dirname+"//index.html");
});
app.use("/",function(request,response){
    var num1=Number(request.body.num1);
    var num2=Number(request.body.num2);
    var resu=num1+num2;
    console.log(request.body);
    response.send("result of calculation is "+resu);
});
app.get("/bmi",function(request,response){
    response.sendFile(__dirname+"/bmicalci.html");
});
app.use("/bmi",function(request,response){
    var weight=parseFloat(request.body.weight);
    var height=parseFloat(request.body.height);
    var bmi=weight/(height*height);
    console.log(request.body);
    response.send("body mass index  is "+bmi);
});
app.listen(5000,function(){
    console.log("server started on port 5000");
});