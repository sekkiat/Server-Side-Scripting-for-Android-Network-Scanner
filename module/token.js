var database = require('../routes/database_connection');
var ObjectId = database.Schema.Types.ObjectId;
var tokenSchema = database.Schema({
    token: String,
    user_id: ObjectId,
    expired: Date,
    status:String
});

module.exports = database.model('tokens',tokenSchema);