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

service.createComment = createComment;
service.getComment = getComment;
service.getAllCommentAssunto = getAllCommentAssunto;
service.updateComment = updateComment;
service.deleteComment = deleteComment;
    
module.exports = service;

function createComment() {}
function getComment() {}
function getAllCommentAssunto() {}
function updateComment() {}
function deleteComment() {}