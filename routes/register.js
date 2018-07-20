var express=require('express');
var crypto=require('crypto');
var ran=require('csprng');
var router=express.Router();
var user=require('../module/user');
var validator=require("email-validator");
var register_token=require('../module/register_token');
var moment=require("moment");
var nodemailer = require('nodemailer');

register=function(email,callback){
    if(validator.validate(email)){
        user.find({email:email},function(err,users){
            var length=users.length;
            var count=0;
            if(length===0){
                register_token.find({$and:[{email:email},{status:"valid"}]},function(err,token){
                   length=token.length;
                   if(length!==0){
                       token.forEach(function(tok){
                           var check=tok.expired-moment.now();
                           if(check>0) {
                               send_mail(email, tok.token, function (found) {
                                   if(found){
                                       callback({"Response": "Token Resend"});
                                   }else{
                                       callback({"Response": "asdError occurs during sending the email"});
                                   }
                               });
                           }else{
                               register_token.update({$and:[{token:tok.token},{email:email}]},{$set:{status:"expired"}},function(err){
                                   if(count===token.length-1){
                                       code_generator(function (tk){
                                           send_mail(email,tk,function(found) {
                                               if(found){
                                                   var rt=new register_token({
                                                       email:email,
                                                       token:tk,
                                                       expired:moment().add(15, 'minute'),
                                                       status:"valid"
                                                   });
                                                   rt.save(function(err){
                                                       callback({"Response": "Token created"})
                                                   });
                                               }else{
                                                   callback({"Response": "asdzError occurs during sending the email"});
                                               }
                                           });
                                       });
                                   }
                                   count++;
                               });
                           }
                       });
                   }else{
                       code_generator(function (tk){
                           send_mail(email,tk,function(found) {
                               if(found){
                                   var rt=new register_token({
                                       email:email,
                                       token:tk,
                                       expired:moment().add(15, 'minute'),
                                       status:"valid"
                                   });
                                   rt.save(function(err){
                                       callback({"Response": "Token created"})
                                   });
                               }else{
                                   callback({"Response": "zzzError occurs during sending the email"});
                               }
                           });
                       });
                   }
                });
            }else{
                callback({'Response':"Email already Registered"});
            }
        });
    }else{

        callback({'Response':"Email Not Valid"});

    }
};

function code_generator(callback){
    //first argument - size
    //buffer - generating bytes
    crypto.randomBytes(3, function(err, buffer) {
        //parseInt - parse a string arguments to int
        callback(parseInt(buffer.toString('hex'), 16).toString().substr(0,4));
    });
}

function send_mail(email,token,callback){
    var transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: 'watchdogscanner@gmail.com',
            pass: 'W@tchD0g_Scanner01172017'
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    var mailOption={
        from: '"No-Reply:Network Scanner <watchdogscanner@gmail.com>',
        to: email,
        subject: "Network Scanner Register",
        generateTextFromHTML: true,
        html: "Key in the token to register the user "+"<b>"+token+"</b>"
    };

    transporter.sendMail(mailOption,function (error,response) {
        if (error) {
            transporter.close();
            callback(false);
        } else {
            transporter.close();
            callback(true);
        }
    });
}

router.post('/',function(req,res){
    var email=req.body.email;
   register(email,function(found){
      console.log(found);
      res.json(found);
   });
});

module.exports = router;