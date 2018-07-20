var database = require('../routes/database_connection');

var userSchema = database.Schema({
    token : String,
    name:String,
    email: String,
    education:String,
    country:String,
    hashed_password: String,
    salt : String,
    img_url:String,
    expired_time:Date
});

module.exports = database.model('users',userSchema);