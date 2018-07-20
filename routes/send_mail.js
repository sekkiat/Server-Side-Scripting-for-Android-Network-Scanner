var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var token=require('../module/token');
var user=require('../module/user');
var validator=require("email-validator");
var moment=require("moment");
var crypto = require('crypto');

function create_token(email,callback) {
    if (validator.validate(email)) {
        user.find({email: email}, function (err, user) {
            var code;
            var count=0;
            var length = user.length;
            if(length!==0) {
                var user_id = user[0]._id;
                token.find({user_id:user_id},function(err,user){
                    var length=user.length;
                    if(length!==0){
                        user.forEach(function(tok){
                            var check=tok.expired-moment.now();
                            if(check>0&&tok.status==="valid") {
                                send_mail(email,tok.token,function (found) {
                                    if(found){
                                        callback({"Response": "Token Resend"});
                                    }else{
                                        callback({"Response": "Error occurs during sending the email"});
                                    }
                                });
                            }else{
                                if(tok.status==="valid"){
                                    token.update({$and:[{token:tok.token},{user_id:user_id}]},{$set:{status:"expired"}},function(err){
                                    });
                                }
                                if(count===user.length-1){
                                    code_generator(function (tk) {
                                        code = tk;
                                        send_mail(email, code, function (found) {
                                            if (found) {
                                                var new_token = new token({
                                                    user_id: user_id,
                                                    token: code.toString(),
                                                    status:"valid",
                                                    expired: moment().add(2, 'hour')
                                                });
                                                new_token.save(function (err) {
                                                    callback({"Response":"Email Successfully Sent"});
                                                });
                                            } else {
                                                callback({"Response": "Error occurs during sending the email"});
                                            }
                                        });
                                    });
                                }
                            }
                            count++;
                        });
                    }else{
                        code_generator(function (tk) {
                            code = tk;
                            send_mail(email, code, function (found) {
                                if (found) {
                                    var new_token = new token({
                                        user_id: user_id,
                                        token: code.toString(),
                                        status:"valid",
                                        expired: moment().add(2, 'hour')
                                    });
                                    new_token.save(function (err) {
                                        callback({"Response":"Email Successfully Sent"});
                                    });
                                } else {
                                    callback({"Response": "Error occurs during sending the email"});
                                }
                            });
                        });
                    }
                });
            }else{
                callback({'Response': "(Fake) Email successfully sent"}); //fake
            }
    });
    }else {
        callback({"Response": "Email Invalid"});
    }
}

function code_generator(callback){
    //first argument - size
    //buffer - generating bytes
    crypto.randomBytes(3, function(err, buffer) {
        //parseInt - parse a string arguments to int
        callback(parseInt(buffer.toString('hex'), 16).toString().substr(0,4));
    });
}

function send_mail(email,token,callback){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'watchdogscanner@gmail.com',
            pass: 'W@tchD0g_Scanner01172017'
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    var mailOptions = {
        from: '"No-Reply:Network Scanner" <watchdogscanner@gmail.com>',
        to: email,
        subject: "Network Scanner Reset Password",
        generateTextFromHTML: true,
        html: "Follow the code to change the password "+"<b>"+token+"</b>"
    };
    transporter.sendMail(mailOptions, function(error, response) {
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
    create_token(email,function(found){
        console.log(found);
        res.json(found);
    });
});

module.exports=router;

/**can't get the XOAuth authentication from the Gmail**/

// var smtpTransport = nodemailer.createTransport( {
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     Service:'Gmail',
//     auth: {
//         XOAuth2: {
//             user: "vavaoongs@gmail.com", // Your gmail address.
//             // Not @developer.gserviceaccount.com
//             clientId: "667816540588-b7nbr3r3nm0f8iif19qt7940n4u3ci8h.apps.googleusercontent.com",
//             clientSecret: "xxu_aONbg_nQWnvWzfz39UXC",
//             refreshToken: "1/ch__cB5NR8UGWHXJGEySaBPIpGdhGWmhOMjHso6PESc"
//
//         }
//     },
//     tls:{
//         rejectUnauthorized:false
//     }
// });
