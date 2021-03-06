const { response } = require('express');
var express = require('express');
var router = express.Router();
var forum = require('../services/forum.service');

// routes
router.post('/', createAssunto);
router.get('/', getAllForum);
router.get('/:id', getAssunto);
router.put('/', updateAssunto);
router.delete('/', deleteAssunto)

module.exports = router;

function createAssunto(req, res){
    forum.createAssunto(req.body)
        .then(function () {
            res.sendStatus(201)
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function getAllForum(req, res){
    if ("topico" in req.query) 
        getTopico(req, res);
    else {
        forum.getAllForum()
            .then(function (listForum) {
                res.send(listForum).status(200);
            })
            .catch(function (err) {
                res.status(400).send(err)
            });
    }    
}

function getTopico(req, res){
    forum.getTopico(req.query.topico)
        .then(function (listTopico) {
            res.send(listTopico).status(200);
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function getAssunto(req, res){
    forum.getAssunto(req.params.id)
        .then(function (listAssunto) {
            res.send(listAssunto).status(200);
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function updateAssunto(req, res){
    forum.updateAssunto(req.body)
        .then(function () {
            res.sendStatus(201)
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function deleteAssunto(req, res){
    forum.deleteAssunto()
        .then(function () {
            res.sendStatus(204)
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}