var config = require('../config.json');
var Q = require('q');
var connection = process.env.connectionStringV2 || config.connectionStringV2;
var database = process.env.databaseV2 || config.databaseV2;
const ObjID = require('mongodb').ObjectId;
const mongo = require('mongodb').MongoClient;
mongo.connect(connection, { useUnifiedTopology: true })
    .then(conn => global.conn = conn.db(database))
    .catch(err => console.log(err));

var service = {};
service.createAssunto = createAssunto;
service.getAllForum = getAllForum;
service.getTopico = getTopico;
service.getAssunto = getAssunto;
service.updateAssunto = updateAssunto;
service.deleteAssunto = deleteAssunto;
    
module.exports = service;

function createAssunto(assunto) {
    var deferred = Q.defer();    
    var forumDB = global.conn.collection("forum");

    forumDB.insertOne(assunto, 
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        }
    );      

    return deferred.promise;
}
function getAllForum() {
    var deferred = Q.defer();    
    var forumDB = global.conn.collection("forum");

    forumDB.find().toArray(function (err, list) {
        if (err) deferred.reject(err.name + ': ' + err.message);
                            
        deferred.resolve({listForum: list});        
    });     

    return deferred.promise;
}
function getTopico(topico) {
    var deferred = Q.defer();    
    var forumDB = global.conn.collection("forum");

    forumDB.find({"topico": topico}).toArray(function (err, list) {
        if (err) deferred.reject(err.name + ': ' + err.message);
                            
        deferred.resolve({listTopico: list});        
    });     

    return deferred.promise;
}
function getAssunto(id) {
    var deferred = Q.defer();    
    var forumDB = global.conn.collection("forum");

    forumDB.findOne({_id: new ObjID.createFromHexString(assunto)}).toArray(function (err, assunto) {
        if (err) deferred.reject(err.name + ': ' + err.message);  
        
        if (assunto) {
            getAssuntoComments(id, assunto, deferred);
        } else {
            deferred.reject("Assunto não encontrado!");
        }        
    });   

    return deferred.promise;    
}

function getAssuntoComments(id, assunto, deferred) {
    var listComments = [];
    listComments.includes(assunto);

    var commentsDB = global.conn.collection("Comments");
    commentsDB.find({idAssunto: assunto}, 
        function (err, list) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            listComments.includes(list);

            deferred.resolve(listComments);
        });
}

function updateAssunto(assunto) {
    var deferred = Q.defer();    
    var forumDB = global.conn.collection("forum");

    forumDB.findOne({_id: new ObjID.createFromHexString(assunto._id)}, function (err, assuntoDoc) {
        if (err) deferred.reject(err.name + ': ' + err.message);  
        
        if (assuntoDoc) {
            updateAssunto(assunto, assuntoDoc._id, deferred);
        } else {
            deferred.reject("Assunto não encontrado!");
        }        
    });   
}

function updateAssunto(assunto, id, deferred) {
    var forumDB = global.conn.collection("forum");

    forumDB.updateOne({_id: new ObjID.createFromHexString(id)}, { $set: assunto }, 
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);            

            deferred.resolve(doc);
        });
}

function deleteAssunto() {}
