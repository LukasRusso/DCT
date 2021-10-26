var config = require('config.json');
var lodash = require('lodash');
var bcrypt = require('bcryptjs');
var Q = require('q');
var connection = process.env.connectionStringV2 || config.connectionStringV2;
var database = process.env.databaseV2 || config.databaseV2;
const ObjID = require('mongodb').ObjectId;
const mongo = require('mongodb').MongoClient;
mongo.connect(connection, { useUnifiedTopology: true })
    .then(conn => global.conn = conn.db(database))
    .catch(err => console.log(err));

var service = {};
service.createUser = createUser;
service.loginUser = loginUser;
service.updateUser = updateUser;
service.deleteUser = deleteUser;
    
module.exports = service;

//Cria um user para login do usuário
function createUser(user) {
    var deferred = Q.defer();    
    var userDB = global.conn.collection("user");

    if (!(Object.keys(user).includes("email") && Object.keys(user).includes("senha")))  
        deferred.reject("The User must have email and senha!")
    else
    {
        userDB.findOne({email: user.email}, 
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
    
                if (doc) {
                    // Login already exists
                    deferred.reject('Email "' + user.email + '" is already exists');
                } else {
                    create(user, userDB, deferred);
                }
            });
    }    

    return deferred.promise;
}

function create(user, userDB, deferred) {
    var usuario = lodash.omit(user, 'senha');   

    //hide password of client
    usuario.hash = bcrypt.hashSync(user.senha, 10);

    userDB.insertOne(usuario, 
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        });
}    

//Atualiza os dados do usuário, como campo e senha
function updateUser(user) {
    var deferred = Q.defer();
    var userDB = global.conn.collection("user");

    if (!(Object.keys(user).includes("_id") && Object.keys(user).includes("email") && Object.keys(user).includes("senha")))  
        deferred.reject("Incorrect parameters, please check!")
    else
    {
        userDB.findOne({_id: new ObjID.createFromHexString( user._id)}, function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                if (doc) {
                    // Login already exists, so update
                    update(user, userDB, deferred);
                } else {
                    deferred.reject('_id "' + user._id + '" isn\'t exists');
                }
            });            
    }

    return deferred.promise;
}

function update(user, userDB, deferred) {     
    var usuario = lodash.omit(user, 'senha');   
    delete usuario._id;

    //hide password of client
    usuario.hash = bcrypt.hashSync(user.senha, 10);
    userDB.updateOne( {_id: new ObjID.createFromHexString(user._id)}, { $set: usuario },
        function (err, doc) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }

            deferred.resolve(doc);
        });
}

//Insere uma historia de usuario, se o body for preenchido
function loginUser(user) {
    var deferred = Q.defer();
    var userDB = global.conn.collection("user");

    if (!(Object.keys(user).includes("email") && Object.keys(user).includes("senha")))  
        deferred.reject("The User must have 'email' and 'senha'!")
    else
    {
        userDB.findOne({email: user.email}, function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                if(doc && bcrypt.compareSync(user.senha, doc.hash))
                    deferred.resolve("User Authenticated!");
                else
                    deferred.reject("Incorrect username or password.");                  
            });            
    }

    return deferred.promise;
}

//Deleta os dados de login do usuário
function deleteUser(user) {
    var deferred = Q.defer();
    var userDB = global.conn.collection("user");

    if (!Object.keys(user).includes("_id"))  
        deferred.reject("The User must have _id!")
    else
    {
        userDB.deleteOne({_id: new ObjID.createFromHexString(user._id)},
            function (err, doc) {
                if (err) 
                    deferred.reject(err.name + ': ' + err.message);

                if(doc.deletedCount == 1)
                    deferred.resolve();
                else
                    deferred.resolve("Not found")
            });            
    }

    return deferred.promise;
}