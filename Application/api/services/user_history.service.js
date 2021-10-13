var config = require('../config.json');
var Q = require('../../node_modules/q');
var lodash = require('../../node_modules/lodash');
var connection = process.env.connectionString || config.connectionString;
var database = process.env.database || config.database;
const ObjID = require('../../node_modules/mongodb').ObjectId;
const mongo = require('../../node_modules/mongodb').MongoClient;
mongo.connect(connection, { useUnifiedTopology: true })
    .then(conn => global.conn = conn.db(database))
    .catch(err => console.log(err));


var service = {};
service.create = create;
service.list = list;
service.update = update;
service.delete = _delete;

module.exports = service;


//Insere uma historia de usuario, se o body for preenchido
function create(historyParam) {
    var deferred = Q.defer();
    var history = global.conn.collection("history");

    if (Object.keys(historyParam).length === 0)
    {
        deferred.reject("The history cannot be empty !")
    }
    else
    {
        history.insertOne(
            historyParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });

            
    }
    return deferred.promise;
}

//lista todas as historias disponiveis
function list() {
    var deferred = Q.defer();
    var history = global.conn.collection("history");

    history.find().toArray(function (err, history) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (history) {
            // return user (without hashed password)
            deferred.resolve(history);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

// deleta uma unica historia 
function _delete(_id) {
    var deferred = Q.defer();
    var history = global.conn.collection("history");
    history.deleteOne(
        { _id: new ObjID.createFromHexString(_id) },
        function (err) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }

            deferred.resolve();
        });

    return deferred.promise;
}

// atualiza a historia
function update(historyParam) {
    var deferred = Q.defer();
    var history = global.conn.collection("history");
    
    // valida a existencia do id
    history.findOne({ _id: new ObjID.createFromHexString( historyParam._id) }, function (err, history) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (history) {
            updateHistory();
        }
    });

    function updateHistory() {
        // esconde o id do corpo do obj
        var set = lodash.omit(historyParam, '_id');

        //atualização no mongo
        history.updateOne(
            { _id:new ObjID.createFromHexString( historyParam._id) },
            { $set: set },
            function (err, doc) {
                if (err) {
                    deferred.reject(err.name + ': ' + err.message);
                }

                deferred.resolve();
            });
    }

    return deferred.promise;
}



