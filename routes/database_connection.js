var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/network_scanner', { useMongoClient: true });

mongoose.connection.on('connected',function(){
    console.log("Mongoose connection open");
});
mongoose.connection.on('error',function(){
    console.log("Mongoose connection error");
});
mongoose.connection.on('disconnected',function(){
    console.log("Mongoose connection disconnected");
});

module.exports = mongoose;