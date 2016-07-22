var mongodb = require('mongodb').MongoClient;
var settings = require('../settings');
var markdown = require('markdown').markdown;
function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}
module.exports = Post;

Post.prototype.save = function(callback) {
    var date = new Date();
    var time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
    }
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post,
        comments:[]
    };
    mongodb.connect(settings.url,function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            collection.insert(post, {safe: true}, function (err) {
                db.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};
Post.getAll = function(name, callback) {
    mongodb.connect(settings.url,function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection('posts', function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                db.close();
                if (err) {
                    return callback(err);
                }
                docs.forEach(function (doc) {
                  doc.post = markdown.toHTML(doc.post);
                });
                callback(null, docs);
            });
        });
    });
};
//获取一篇文章
Post.getOne = function(name, day, title, callback) {
  //打开数据库
    mongodb.connect(settings.url,function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('posts', function (err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            //根据用户名、发表日期及文章名进行查询
            collection.findOne({
                "name": name,
                "time.day": day,
                "title": title
            }, function (err, doc) {
                db.close();
                if (err) {
                    return callback(err);
                }
                //解析 markdown 为 html
            
                //没加留言前 doc.post = markdown.toHTML(doc.post);
                //加了留言后修改
                if (doc) {
                    doc.post = markdown.toHTML(doc.post);
                    doc.comments.forEach(function (comment) {
                        comment.content = markdown.toHTML(comment.content);
                    });
                    console.log("doc",doc);
                }

                callback(null, doc);//返回查询的一篇文章
            });
        });
    });
};
//返回原始发表的内容（markdown 格式）
Post.edit = function(name, day, title, callback) {
    //打开数据库
    mongodb.connect(settings.url,function (err, db) {
    if (err) {
    return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
    if (err) {
    db.close();
    return callback(err);
    }
    //根据用户名、发表日期及文章名进行查询
    collection.findOne({
    "name": name,
    "time.day": day,
    "title": title
    }, function (err, doc) {
    db.close();
    if (err) {
    return callback(err);
    }
    callback(null, doc);//返回查询的一篇文章（markdown 格式）
    });
    });
    });
};
//更新一篇文章及其相关信息
Post.update = function(name, day, title, post, callback) {
    //打开数据库
    mongodb.connect(settings.url,function (err, db) {
    if (err) {
    return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
    if (err) {
    db.close();
    return callback(err);
    }
    //更新文章内容
    collection.update({
    "name": name,
    "time.day": day,
    "title": title
    }, {
    $set: {post: post}
    }, function (err) {
    db.close();
    if (err) {
    return callback(err);
    }
    callback(null);
    });
    });
    });
};

//删除一篇文章
Post.remove = function(name, day, title, callback) {
    //打开数据库
    mongodb.connect(settings.url,function (err, db) {
    if (err) {
    return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
    if (err) {
    db.close();
    return callback(err);
    }
    //根据用户名、日期和标题查找并删除一篇文章
    collection.remove({
    "name": name,
    "time.day": day,
    "title": title
    }, {
    w: 1
    }, function (err) {
    db.close();
    if (err) {
    return callback(err);
    }
    callback(null);
    });
    });
    });
};