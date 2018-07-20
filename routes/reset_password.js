var express=require('express');
var router=express.Router();
var crypto=require('crypto');
var ran=require('csprng');
var user=require('../module/user');
var tokens=require('../module/token');
var mongoose = require('mongoose');

function reset_password(id,token,old_password,new_password,callback) {
    console.log(id);
    console.log(token);
    password_check(old_password,new_password,function (check) {
        if(check===true){
                tokens.aggregate([{$match:{$and:[{"user_id":new mongoose.Types.ObjectId(id)},{"token":token}]}},
                    {$lookup:{from:"users",localField:"user_id",foreignField:"_id",as:"user"}}]
                ,function (err,users) {
                    var length=users.length;
                    if(length!==0){
                    if((users[0].user_id.equals(users[0].user[0]._id))&& (token===users[0].token)){
                        if(users[0].status==="destroyed"){
                            var salt = ran(160, 36);
                            var password = salt + new_password;
                            var hashed_password = crypto.createHash('sha512').update(password).digest("hex");
                            user.update({email:users[0].user[0].email},{$set:{hashed_password:hashed_password,salt:salt}}
                                ,function (err) {
                                    tokens.update({token:users[0].token},{$set:{status:"invalid"}},function (err) {
                                        callback({"Response":"Update Successfully"});
                                    });
                                });
                        }else{
                            callback({"Response":"Code Invalid"});
                        }
                    }
                }else{
                    callback({"Response":"Something went wrong!"});
                }
            });
        }else{
            callback({"Response":"Password not match"});
        }
    });
}

function password_check(old,newp,callback){
    if(old===newp){
        callback(true);
    }else{
        callback(false)
    }
}
router.post('/',function(req,res){
    var id=req.body.id;
    var token=req.body.token;
    var old_password=req.body.old_password;
    var comfirm_password=req.body.comfirm_password;
    reset_password(id,token,old_password,comfirm_password,function(found){
        console.log(found);
        res.json(found);
    });
});

module.exports=router;