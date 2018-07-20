var user=require('../module/user');
var moment=require('moment');
var crypto=require('crypto');
var ran=require('csprng');

function check_token_time(email,token,callback){
    user.find({token:token},function(err,users){
        var length=users.length;
        if(length!==0){
            if(users[0].email===email){
                var check=users[0].expired_time-moment.now();
                if(check>0){
                    callback({"Response":"Updated","Token":token});
                }else{
                    var new_token = crypto.createHash('sha512').update(email +ran(160,36)).digest("hex");
                    var time=moment().add(2,'hours');
                    user.update({token:token},{$set:{"token":new_token,"expired_time":time}},function(err,suc){
                        if(suc!==null){
                            callback({"Response":"Updated","Token":new_token});
                        }else{
                            callback({"Response":"Error Occurs"});
                        }
                    });
                }
            }else{
                callback({"Response":"Email Invalid"});
            }
        }else{
            callback({"Response":"Token Invalid"});
        }
    });
}

module.exports =check_token_time;
