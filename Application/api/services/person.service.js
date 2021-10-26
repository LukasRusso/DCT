var config = require('config.json');
var Q = require('q');
var connection = process.env.connectionStringV2 || config.connectionStringV2;
var database = process.env.databaseV2 || config.databaseV2;
const ObjID = require('mongodb').ObjectId;
const mongo = require('mongodb').MongoClient;
mongo.connect(connection, { useUnifiedTopology: true })
    .then(conn => global.conn = conn.db(database))
    .catch(err => console.log(err));

var service = {};
service.createPerson = createPerson;
service.listPerson = listPerson;
service.getPersonById = getPersonById;
service.updatePerson = updatePerson;
service._deleteUser = _deleteUser;
    
module.exports = service;

//Cria um user para login do usuário
function createPerson(person) {
    var deferred = Q.defer();    
    var personDB = global.conn.collection("person");

    //check all fields 
    var check = checkPerson(person);
    if(check.length != 0){
        deferred.reject(check);
    }       
    
    personDB.findOne({email: person.email}, 
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (doc) {
                // Login already exists
                deferred.reject('Email "' + person.email + '" is already exists, Did you forget your password?');
            } else {
                create(person, personDB, deferred);
            }
        }
    );    

    return deferred.promise;
}

//create object in database
function create(person, personDB, deferred) {
    delete person.senha;
    
    personDB.insertOne(person, 
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        });
}    

//check all fields riquered
function checkPerson(person){
    var check = "";
    var _keys = ["firstName", "lastName", "email"];

    for(var k of _keys)  
        if(!Object.keys(person).includes(k))
            check += ("Key '" + k + "' not found!");

    return check;
}

//Atualiza os dados do usuário, como campo e senha
function updatePerson(person) {
    var deferred = Q.defer();
    var personDB = global.conn.collection("person");

    //check all fields 
    var check = checkPerson(person);

    if (!Object.keys(person).includes("_id") || check.length != 0)  
        deferred.reject("The Person must have _id!\n" + check)
    else
    {
        personDB.findOne({_id: new ObjID.createFromHexString(person._id)}, function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                if (doc) {
                    // Login already exists, so update
                    update(person, personDB, deferred);
                } else {
                    deferred.reject('_id "' + person._id + '" isn\'t exists');
                }

                deferred.resolve();
            });            
    }

    return deferred.promise;
}

function update(person, personDB, deferred) { 
    var _id = person._id;

    delete person.senha;
    delete person._id;

    personDB.updateOne( {_id: new ObjID.createFromHexString(_id)}, { $set: person },
        function (err, doc) {
            if (err) {
                deferred.reject(err.name + ': ' + err.message);
            }

            deferred.resolve(doc);
        });
}

function getPersonById(person) {
    var deferred = Q.defer();
    var personDB = global.conn.collection("person");

    if(Object.keys(person).includes("_id")){
        personDB.findOne({_id: new ObjID.createFromHexString(person._id)}, function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve(doc);
        });  
    }       
    else {
        deferred.reject("The Person must have _id!");
    }      
    
    return deferred.promise;  
}

//Insere uma historia de usuario, se o body for preenchido
function listPerson() {
    var deferred = Q.defer();
    var personDB = global.conn.collection("person");
    
    personDB.find().toArray(function (err, list) {
        if (err) deferred.reject(err.name + ': ' + err.message);
                            
        deferred.resolve({listPerson: list});
        
    });     

    return deferred.promise;
}

//Deleta os dados de login do usuário
function _deleteUser(person) {
    var deferred = Q.defer();
    var personDB = global.conn.collection("person");

    if (!Object.keys(person).includes("_id"))  
        deferred.reject("The Person must have _id!")
    else
    {
        personDB.deleteOne({_id: new ObjID.createFromHexString(person._id)},
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                if(doc.deletedCount == 1)
                    deferred.resolve();
                else
                    deferred.resolve("Not found")

                deferred.resolve();
            });            
    }

    return deferred.promise;
}