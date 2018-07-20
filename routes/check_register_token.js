var express=require('express');
var router=express.Router();
var crypto=require('crypto');
var ran=require('csprng');
var user=require('../module/user');
var token=require('../module/token');
var mongoose=require('mongoose');
var register_token=require('../module/register_token');
var moment=require('moment');

function check_token(email,code,callback){
    register_token.find({$and:[{email:email},{token:code}]},function(err,token){
        var length=token.length;
        if(length!==0){
            if(token[0].status==="valid"){
            var check=token[0].expired-moment.now();
            if(check>0){
                register_token.update({$and:[{email:email},{token:code}]},{$set:{status:"invalid"}},function(err){
                        callback({"Response": "User Registered"});
                });
            }else{
                register_token.update({$and:[{email:email},{token:code}]},{$set:{status:"expired"}},function(err){
                    callback({"Response":"Token is expired"});
                });
            }
            }else{
                callback({"Response":"Token is used"});
            }
        }else{
            callback({"Response":"Code Not Match!"});
        }

    });
}


router.post('/',function(req,res){
    var email=req.body.email;
    var token=req.body.token;
    check_token(email,token,function(found){
        console.log(found);
        res.json(found);
    })
});

module.exports = router;