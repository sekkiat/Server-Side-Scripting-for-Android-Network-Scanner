var express=require('express');
var user=require('../module/user');
var ran=require('csprng');
var crypto=require('crypto');
var router=express.Router();
var moment=require("moment");

function login(email,password,callback){
    user.find({email:email},function (err,users) {
        var length=users.length;
        if(length===0){
            callback({'response':"no user found"});
        }else{
            var user_email=users[0].email;
            var user_password=users[0].hashed_password;
            var user_salt=users[0].salt;
            var hashed_password=crypto.createHash('sha512').update(user_salt+password).digest("hex");
            if(email===user_email){
                if(hashed_password===user_password){
                    var token = crypto.createHash('sha512').update(user_email +ran(160,36)).digest("hex");
                        user.update({email:user_email},{$set:{token:token,expired_time:moment().add(2,'hour')}},function (err) {
                            user.find({email:user_email},function(err,users){
                                callback({"Response":"Login Successfully","User":[{"name":users[0].name,"token":token,
                                        "expired_time":users[0].expired_time}]});
                            });
                    });
                }else{
                    callback({"Response":"password invalid"});
                }

            }else{
                callback({"Response":"email invalid"});
            }

        }

    })
}

router.post('/',function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    login(email,password,function(found){
       console.log(found);
       res.json(found);
    });
});

module.exports = router;