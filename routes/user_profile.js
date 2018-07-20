var express=require('express');
var crypto=require('crypto');
var ran=require('csprng');
var router=express.Router();
var user=require('../module/user');
var formidable=require('formidable');
var fs=require('fs');
var validator=require("email-validator");
var mongoose = require('mongoose');
var ctt=require("../routes/check_token_time");
var moment=require("moment");
var multer  = require('multer');
var mime=require('mime');
var filepath;
//disk storage -save the file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            filepath=raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype);
            cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype));
        });
    }
});

var upload = multer({ storage: storage });

function change_email(email,email2,token,callback){
    if(validator.validate(email)) {
        ctt(email2,token,function(found){
            if(found.Response==="Updated"){
                user.update({token:found.Token},{$set:{email:email}},function (err,success) {
                    if(success===null){
                        callback({"Response":"Update Fail"});
                    }else{
                        callback({"Response":"Update Succesfully","User":[{"email":email,"token":found.token}]});
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
        callback({"Response":"Email Invalid"});
    }
}

function change_education(education,email,token,callback) {
    if (education.length !== 0) {
        ctt(email,token,function(found){
            if(found.Response==="Updated"){
                user.update({token:found.Token},{$set:{education:education}},function (err,success) {
                    if(success===null){
                        callback({"Response":"Update Fail"});
                    }else{
                        callback({"Response":"Update Succesfully","User":[{"education":education,"token":found.Token}]});
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
        callback({"Response":"Please fill in the name"});
    }
}

function change_name(email,name,token,callback) {
    if (name.length !== 0) {
        ctt(email,token,function(found){
            if(found.Response==="Updated"){
                user.update({token:found.Token},{$set:{name:name}},function (err,success) {
                    if(success===null){
                        callback({"Response":"Update Fail"});
                    }else{
                        callback({"Response":"Update Succesfully","User":[{"name":name,"token":found.Token}]});
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
        callback({"Response":"Please fill in the name"});
    }
}

function change_country(email,country,token,callback) {
    if (country.length !== 0) {
        ctt(email,token,function(found){
            if(found.Response==="Updated"){
                user.update({token:found.Token},{$set:{country:country}},function (err,success) {
                    if(success===null){
                        callback({"Response":"Update Fail"});
                    }else{
                        callback({"Response":"Update Succesfully","User":[{"country":country,"token":found.Token}]});
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
        callback({"Response":"Please fill in the country"});
    }
}

function change_password(email,password,token,callback){
    user.find({token:token},function (err,users) {
        var length=users.length;
        if(length!==0){
                var salt=ran(160,36);
                var new_password=salt+password;
                var hashed_password=crypto.createHash('sha512').update(new_password).digest("hex");
                ctt(email,token,function(found){
                    if(found.Response==="Updated"){
                        user.update({token:found.Token},{$set:{hashed_password:hashed_password,salt:salt}},function (err,success) {
                            if(success===null){
                                callback({"Response":"Update Fail"});
                            }else{
                                callback({"Response":"Update Succesfully","token":found.Token});
                            }
                        });
                    }else if(found.Response==="Email Invalid"){
                        callback({"Response":"Email Invalid"});
                    }else if(found.Response==="Error Occurs"){
                        callback({"Response":"Something went wrong!"});
                    }else if(found.Response==="Token Invalid"){
                        callback({"Response":"Token Invalid"});
                    }
                });
        }else{
            callback({"Response":"Token Invalid"});
        }
    });
}

function check_password(email,password_check,token,callback){
    user.find({token:token},function (err,users) {
        var length=users.length;
        if(length!==0){
            var user_password=users[0].hashed_password;
            var user_salt=users[0].salt;
            var check_password=crypto.createHash('sha512').update(user_salt+password_check).digest("hex");
            if(check_password===user_password){
                ctt(email,token,function(found){
                    if(found.Response==="Updated"){
                        callback({"Response":"True","token":found.Token});
                    }else if(found.Response==="Email Invalid"){
                        callback({"Response":"Email Invalid"});
                    }else if(found.Response==="Error Occurs"){
                        callback({"Response":"Something went wrong!"});
                    }else if(found.Response==="Token Invalid"){
                        callback({"Response":"Token Invalid"});
                    }
                });
            }else{
                callback({"Response":"Password Incorrect"});
            }
        }else{
            callback({"Response":"Token Invalid"});
        }
    });
}

function change_picture(email,img_url,token,callback) {
    if (img_url.length !== 0) {
        ctt(email,token,function(found){
            if(found.Response==="Updated"){
                user.update({token:found.Token},{$set:{img_url:img_url}},function (err,success) {
                    if(success===null){
                        callback({"Response":"Update Fail"});
                    }else{
                        callback({"Response":"Update Succesfully","User":[{"img_url":img_url,"token":found.Token}]});
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
        callback({"Response":"No Image Found"});
    }
}

function upload_picture(req,callback){
    var path;
    //upload a file using this form
    var form=new formidable.IncomingForm();
    form.uploadDir="./Uploads";
    form.keepExtensions=true;
    form.maxFieldsSize=10*1024*1024;
    form.multiples=true;
    form.parse(req, function(err, fields, files) {
        if(err){
            callback({"Response":"false"});
        }
        var arrayoffile=files["image"];
        var filename = [];
            path=arrayoffile.path.split("\\")[1];
            filename.push(path);
        callback({"Response":"true","Image_URL":path});

    });
}

router.post('/name',function(req,res){
    var name=req.body.name;
    var token=req.body.token;
    var email=req.body.email;
    change_name(email,name,token,function(found){
        console.log(found);
        res.json(found);
    });
});

router.post('/password',function(req,res){
    var password=req.body.password;
    var token=req.body.token;
    var email=req.body.email;
    change_password(email,password,token,function(found){
        console.log(found);
        res.json(found);
    });
});

router.post('/education',function(req,res){
    var education=req.body.education;
    var email=req.body.email;
    var token=req.body.token;
    change_education(education,email,token,function(found){
        console.log(found);
        res.json(found);
    });
});

router.post('/country',function(req,res){
    var country=req.body.country;
    var email=req.body.email;
    var token=req.body.token;
    console.log(email);
    console.log(country);
    change_country(email,country,token,function(found){
        console.log(found);
        res.json(found);
    });
});


router.post('/check_password',function(req,res){
    var password=req.body.password;
    var email=req.body.email;
    var token=req.body.token;
    check_password(email,password,token,function(found){
        console.log(found);
        res.json(found);
    });
});

router.post('/picture',upload.single('image'),function(req,res){
    var img_url=filepath;
    var email=req.body.email;
    var token=req.body.token;
    change_picture(email,img_url,token,function(found){
        console.log(found);
        res.json(found);
    });
});

router.get("/image",function(req,res){
   var image="uploads/"+req.query.image;
    fs.readFile(image,function(err,data){
       if(err){
           console.log({"Response":"Something went wrong!"});
           res.json({"Response":"Something went wrong!"});
       }else{
           res.writeHead(200,{'Content-Type':'image/jpeg'});
           res.end(data);
       }
    });
});

module.exports = router;