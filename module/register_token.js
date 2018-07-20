var database = require('../routes/database_connection');

var register_tokenShcema=database.Schema({
   token:String,
   email:String,
   expired:Date,
   status:String
});

module.exports=database.model('register_tokens',register_tokenShcema);