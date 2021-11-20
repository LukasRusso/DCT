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
service.deleteTopico = deleteTopico;
    
module.exports = service;

function createAssunto() {}
function getAllForum() {}
function getTopico() {}
function getAssunto() {}
function updateAssunto() {}
function deleteTopico() {}
