var express=require('express');
var router=express.Router();
var crypto=require('crypto');
var ran=require('csprng');
var user=require('../module/user');
var token=require('../module/token');
var mongoose=require('mongoose');
var register_token=require('../module/register_token');
var moment=require('moment');
var validator=require("email-validator");

function register_user(email,name,password,callback){
    if(validator.validate(email)){
        var salt=ran(160,36);
        var new_password=salt+password;
        var hashed_password=crypto.createHash('sha512').update(new_password).digest("hex");
        var token = crypto.createHash('sha512').update(email +ran(160,36)).digest("hex");
        var time=moment().add(2,'hour');
        var new_user=new user({
            name:name,
            email:email,
            hashed_password:hashed_password,
            salt:salt,
            education:"",
            country:"",
            img_url:"",
            token:token,
            expired_time:time
        });
        new_user.save(function(err,success){
            if(success===null){
                callback({"Response":"Update Fail"});
            }else{
                callback({"Response":"Update Succesfully","User":[{"name":name,"token":token,"expired_time":time}]});
            }
        });
    }
}

/**example for find one and update**/
// user.findOneAndUpdate({email:email},{$set:{salt:salt,hashed_password:hashed_password,name:name,token:token,expired_time:time}},function(err,success)

router.post('/',function(req,res){
    var email=req.body.email;
    var name=req.body.name;
    var password=req.body.password;
    register_user(email,name,password,function(found){
        console.log(found);
        res.json(found);
    })
});

module.exports = router;