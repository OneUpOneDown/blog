var mongo = require('mongodb'),
    Db = mongo.Db,
    Connection = mongo.Connection,
    Server = mongo.Server;

var server = new Server('localhost', 27017, {auto_reconnect: true});

module.exports = new Db('blog', server);