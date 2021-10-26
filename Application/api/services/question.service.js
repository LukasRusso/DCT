var config = require('config.json');
var Q = require('q');
var lodash = require('lodash');
var connection = process.env.connectionStringV2 || config.connectionStringV2;
var database = process.env.databaseV2 || config.databaseV2;
const ObjID = require('mongodb').ObjectId;
const mongo = require('mongodb').MongoClient;
mongo.connect(connection, { useUnifiedTopology: true })
    .then(conn => global.conn = conn.db(database))
    .catch(err => console.log(err));


var service = {};
service.create = create;
service.list = list;
service.update = update;
service.delete = _delete;

module.exports = service;


//Cria uma nova questão
function create(questionParams) {
    var deferred = Q.defer();
    var question = global.conn.collection("question");

    if (Object.keys(questionParams).length === 0)
    {
        deferred.reject("Favor preencher a questão!")
    }
    else
    {
        question.insertOne(
            questionParams,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });

            
    }
    return deferred.promise;
}

//lista todas questões
function list() {
    var deferred = Q.defer();
    var question = global.conn.collection("question");

    question.find().toArray(function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question) {
            // return user (without hashed password)
            deferred.resolve(question);
        } else {
            // user not found
            deferred.resolve();
        }
    });
    return deferred.promise;
}

// deleta uma questão
function _delete(_id) {
    var deferred = Q.defer();
    var question = global.conn.collection("question");
    question.deleteOne(
        { _id: new ObjID.createFromHexString(_id) },
        function (err) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }

            deferred.resolve();
        });

    return deferred.promise;
}

// atualiza uma questão em caso de erro
function update(questionParam) {
    var deferred = Q.defer();
    var question = global.conn.collection("question");
    
    // valida a existencia do id
    question.findOne({ _id: new ObjID.createFromHexString( questionParam._id) }, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question) {
            updateQuestion();
        }
    });

    function updateQuestion() {
        // esconde o id do corpo do obj
        var set = lodash.omit(questionParam, '_id');

        //atualização no mongo
        question.updateOne(
            { _id:new ObjID.createFromHexString( questionParam._id) },
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



