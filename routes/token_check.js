var express=require('express');
var crypto=require('crypto');
var ran=require('csprng');
var router=express.Router();
var user=require('../module/user');
var validator=require("email-validator");

register=function(email,password,callback){
    if(validator.validate(email)){
        if(password_validate(password)){
            /**option 2-base**/
            var salt=ran(160,36);
            var new_password=salt+password;
            /**digest-encoding**/
            var hashed_password = crypto.createHash('sha512').update(new_password).digest("hex");
            var newuser=new user({
                token:"",
                email:email,
                hashed_password:hashed_password,
                salt:salt,
                img_url:""

            });
            user.find({email:email},function (err,users) {
                var length=users.length;
                if(length===0){
                    newuser.save(function(err){
                        callback({'response':"Sucessfully Registered"});
                    });
                }else{
                    callback({'response':"Email already Registered"});
                }
            });
        }else{
            callback({'response':"Password Weak"});
        }
    }else{

        callback({'response':"Email Not Valid"});

    }
};

function password_validate(password){
    return password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) &&
        password.length > 4 && password.match(/[0-9]/) &&
        password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/);
}

router.post('/',function(req,res){
    var email=req.body.email;
    var password=req.body.password;
    register(email,password,function(found){
        console.log(found);
        res.json(found);
    });
});

module.exports = router;