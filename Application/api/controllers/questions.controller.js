var express = require('express')
var router = express.Router()
var questionService = require('services/question.service')

// routes
router.post('/', createQuestion)
router.get('/', listQuestions)
router.put('/', updateQuestion)
router.delete('/', deleteQuestion)

module.exports = router

function createQuestion(req, res) {
  questionService
    .create(req.body)
    .then(function () {
      res.sendStatus(200)
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}

function listQuestions(req, res) {
  questionService
    .list()
    .then(function (history) {
      if (history) {
        res.send(history)
      } else {
        res.sendStatus(404)
      }
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}

function deleteQuestion(req, res) {
  var questionID = req.body._id
  questionService
    .delete(questionID)
    .then(function () {
      res.sendStatus(200)
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}

function updateQuestion(req, res) {
  questionService
    .update(req.body)
    .then(function () {
      res.sendStatus(200)
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}
