var mongo = require('mongodb'),
    db = mongo.Db,
    Connection = mongo.Connection,
    Server = mongo.Server;
//本地数据库
// var server = new Server('localhost', 27017, {auto_reconnect: true});
// module.exports = new Db('blog', server);

// 服务器数据库
var server = new Server('mongodb://admin:123456@ds023425.mlab.com', 23425, {auto_reconnect: true});
module.exports = new db('blog', server);