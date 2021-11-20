const { response } = require('express');
var express = require('express');
var router = express.Router();
var forum = require('../services/forum.service');

// routes
router.post('/', createAssunto);
router.get('/', getAllForum);
router.get('/:type', getTopico);
router.get('/:id', getAssunto);
router.put('/', updateAssunto);
router.delete('/', deleteTopico)

module.exports = router;

function createAssunto(req, res){
    console.log("createAssunto");
}

function getAllForum(req, res){
    console.log("getAllForum");
}

function getTopico(req, res){
    console.log("getTopico");
}

function getAssunto(req, res){
    console.log("getAssunto");
}

function updateAssunto(req, res){
    console.log("updateAssunto");
}

function deleteTopico(req, res){
    console.log("deleteTopico");
}