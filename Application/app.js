'use strict';

require('rootpath')(); 

var debug = require('debug');
var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
//var routes = require('./routes/index');
//var users = require('./routes/users');

var server; 
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

// Essa configuração na API indica que haverá JWT para cada endpoint / rota método, com exceção dos métodos
// de autenticação, registro de usuários e sobre. Essa camada de segurança é muito boa, porque ajuda
// na diminuição do tratamento de mensagens indevidas na aplicação
//api.use('/api', expressJwt({ secret: process.env.secret || config.secret }).unless({ path: ['/api/about','/api/users/authenticate', '/api/users/register'] }));

//documentação das APIs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {explorer: true}));

//roteamento das API as devidas controllers
app.use('/api/userHistory', require('./controllers/api/user_history.controller'));
app.use('/api/user', require('./controllers/api/user.controller'));
app.use('/api/person', require('./controllers/api/person.controller'));
app.use('/api/questions', require('./controllers/api/questions.controller'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

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