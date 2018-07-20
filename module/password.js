var database = require('../routes/database_connection');

var childschema=database.Schema({
   pass:String
});


var parentSchema =database.Schema({
    Password:[childschema]
});

module.exports = database.model('passwords',parentSchema);