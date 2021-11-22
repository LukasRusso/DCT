const { response } = require('express');
var express = require('express');
var router = express.Router();
var forumComments = require('../services/forumComments.service');

// routes
router.post('/', createComment);
router.get('/', getComment);
router.get('/', getAllCommentAssunto);
router.put('/:id', updateComment);
router.delete('/', deleteComment)


module.exports = router;

function createComment(req, res){
    forumComments.createComment(req.body)
        .then(function () {
            res.sendStatus(201)
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function getComment(req, res){
    forumComments.getComment()
        .then(function (listTopico) {
            res.send(listTopico).status(200);
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function getAllCommentAssunto(req, res){
    forumComments.getAllCommentAssunto(req.params.id)
        .then(function (listAssunto) {
            res.send(listAssunto).status(200);
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function updateComment(req, res){
    forumComments.updateComment(req.body)
        .then(function () {
            res.sendStatus(201)
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}

function deleteComment(req, res){
    forumComments.deleteComment()
        .then(function () {
            res.sendStatus(204)
        })
        .catch(function (err) {
            res.status(400).send(err)
        });
}