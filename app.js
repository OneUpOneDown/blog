var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var settings = require('./settings'); //添加mongodb本地的设置
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();
app.set('port', process.env.PORT || 3000);
//设置views文件夹为存放视图文件的目录，即存放模板文件的地方，
// __dirname为全局变量，存储当前正在执行的脚本所在的目录
app.set('views', path.join(__dirname, 'views')); 
// 设置视图模板引擎为ejs
app.set('view engine', 'ejs');
app.use(flash());
// 设置网页favicon小图标
app.use(favicon(__dirname + '/public/favicon.ico'));
// 加载日志中间件
app.use(logger('dev'));
// 加载解析json中间件
app.use(bodyParser.json());
// 加载解析urlencoded请求的中间件
app.use(bodyParser.urlencoded({ extended: true }));
// 加载cookie的中间件
app.use(cookieParser());

//本地mongodb数据库配置
// app.use(session({
//     secret: settings.cookieSecret,
//     key: settings.db,
//     //cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
//     store: new MongoStore({
//         //url: 'mongodb://localhost:27017/test', 
//         url: 'mongodb://'+settings.host+':'+settings.port+'/'+settings.db, 
//         maxAge: 300000
//     })
// }));
// 服务器mongolab数据库配置
app.use(session({
    secret: settings.cookieSecret,
    key: 'blog',
    //cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},
    store: new MongoStore({
        //url: 'mongodb://localhost:27017/test', 
        url: settings.url, 
        maxAge: 300000
    })
}));

app.use(express.static(path.join(__dirname, 'public')));
//实现路由功能(路由总接口)
// routes 为 var routes = require('./routes/index'); index.js中exports出来的方法
routes(app);
// 增加404页面
app.use(function (req, res) {
    res.render("404");
});
app.listen(app.get('port'), function() {
console.log('Express server listening on port ' + app.get('port'));
});

// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


// module.exports = app;
