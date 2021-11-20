'use strict';

require('rootpath')(); 

var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var expressJwt = require('express-jwt');
var config = require("./api/config.json");
var cors = require('cors');
const corsOptions = {
    origin:'*', 
    credentials: false,            //access-control-allow-credentials:true somente quando as credenciais tiverem liberadas
    optionSuccessStatus: 200,
 }

var expressJwt = require('express-jwt');

var server; 
var app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cors());
app.use(cors(corsOptions));

//authentication
//app.use('/api', expressJwt({ secret: process.env.secret || config.secret }).unless({ path: ['./api/user/authenticate', './api/user/register'] }));

//documentação das APIs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));

//roteamento das API as devidas controllers
app.use('/api/userHistory', require('./api/controllers/user_history.controller'));
app.use('/api/user', require('./api/controllers/user.controller'));
app.use('/api/person', require('./api/controllers/person.controller'));
app.use('/api/questions', require('./api/controllers/questions.controller'));
app.use('/api/forum', require('./api/controllers/forum.controller'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.redirect("/api/docs");
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
else 
{
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}


app.set('port', process.env.PORT || 3030);

exports.listen = function () {
    server = app.listen(app.get('port'), function () {
        debug('Express server listening on port ' + server.address().port);
    });
}

exports.close = function () {
    server.close(() => {
        debug('Server stopped.');
    });
}

console.log('Application started');

this.listen();