var express=require('express');
var router=express.Router();
var crypto=require('crypto');
var ran=require('csprng');
var user=require('../module/user');
var token=require('../module/token');
var mongoose=require('mongoose');
var moment=require('moment');

var count;
function check_token(email,code,callback){
    user.aggregate([{$match:{"email":email}},{$lookup:{from:"tokens",localField:"_id",foreignField:"user_id",as:"token"}}],
               function (err, users) {
               var length=users.length;
               if(length!==0){
                   for(var a=0;a<users[0].token.length;a++){
                       count=a;
                       if(users[0]._id.equals(users[0].token[a].user_id)){
                           if(code===users[0].token[a].token){
                               var check=users[0].token[a].expired-moment.now();
                               if(check<0){
                                   if(a===users[0].token.length-1){
                                       callback({"Response":"false"});
                                   }
                               }else{
                                    if(users[0].token[a].status==="valid"){
                                       token.update({$and:[{user_id:users[0].token[a].user_id},{token:users[0].token[a].token}]},{$set:{status:"destroyed"}},
                                           function (err) {
                                           console.log(users[0].token[count].user_id);
                                               if(count===users[0].token.length-1){
                                                   callback({"Response":"true","Id":users[0].token[count].user_id});
                                               }
                                           });
                                   }
                               }
                           }else{
                               if(a===users[0].token.length-1){
                                   callback({"Response":"Code Didnt Match"});
                               }
                           }
                       }else{
                           if(a===users[0].token.length-1){
                           callback({"Response":"Something went wrong! Id not match!"});
                           }}
                   }
               }else{
                   callback({"Response":"Something went wrong! Email not match!"});
               }
           });
}

router.post('/',function(req,res){
    var email=req.body.email;
    var token=req.body.token;
    check_token(email,token,function(found){
        console.log(found);
        res.json(found);
    });
});

module.exports=router;