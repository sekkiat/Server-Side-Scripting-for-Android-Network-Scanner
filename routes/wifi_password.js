var express=require('express');
var router=express.Router();
var mp=require('../module/password');
var ctt=require("../routes/check_token_time");

var mongoose = require('mongoose');
var tk;
function wifi(check_password,email,token,callback) {
    if (check_password !== "") {
        ctt(email,token,function(found){
            tk=found.Token;
            if(found.Response==="Updated"){
                mp.find({},function(err,found){
                    var length=found.length;
                    if(length!=0){
                        found.forEach(function(password){
                            for(var a=0;a<password.Password.length;a++){
                                if(password.Password[a].pass===check_password){
                                    callback({"Response":"Already have","User":[{"email":email,"token":tk}]});
                                }else{
                                    if(a === password.Password.length - 1){
                                        var doc ={
                                            "pass": check_password
                                        };
                                        mp.updateOne({"_id":new mongoose.Types.ObjectId(password._id)},{$push:{Password:doc}}
                                            ,function (err) {
                                                callback({"Response": "Updated","User":[{"email":email,"token":tk}]})
                                            });
                                    }
                                }
                            }
                        });
                    }else{
                        var rt=new mp({
                            Password:[{pass:check_password}]
                        });
                        rt.save(function(err){
                            callback({"Response": "Saved","User":[{"email":email,"token":tk}]})
                        });
                    }
                });
            }else if(found.Response==="Error Occurs"){
                callback({"Response":"Something went wrong!"});
            }else if(found.Response==="Token Invalid"){
                callback({"Response":"Token Invalid"});
            }else if(found.Response==="Email Invalid"){
                callback({"Response":"Email Invalid"});
            }
        });
    }else{
        callback({"Response":"Password cannot be null"});
    }
}

function get_wifi(email,token,callback) {
        ctt(email,token,function(found){
            tk=found.Token;
            if(found.Response==="Updated"){
                mp.find({},function(err,found){
                    var length=found.length;
                    if(length!=0){
                        found.forEach(function(password){
                                callback({"Response":"Success","User":[{"email":email,"token":tk}],"Password":password.Password});
                        });
                    }else{
                        callback({"Response":"Not Found","User":[{"email":email,"token":tk}]});
                    }
                });
            }else if(found.Response==="Error Occurs"){
                callback({"Response":"Something went wrong!"});
            }else if(found.Response==="Token Invalid"){
                callback({"Response":"Token Invalid"});
            }else if(found.Response==="Email Invalid"){
                callback({"Response":"Email Invalid"});
            }
        });
}

router.post('/add_ssid',function(req,res){
    var password=req.body.password;
    var token=req.body.token;
    var email=req.body.email;
    wifi(password,email,token,function(found){
        console.log(found);
        res.json(found);
    });
});


router.post('/get_ssid',function(req,res){
    var token=req.body.token;
    var email=req.body.email;
    get_wifi(email,token,function(found){
        console.log(found);
        res.json(found);
    });
});

module.exports = router;