var express = require('express');
var router = express.Router();
var historyService = require('services/user_history.service');

// routes
router.post('/', createHistoryPerson);
router.get('/', listHistoryPeople);
router.put('/', updateHistoryPerson);
router.delete('/', deleteHistoryPerson);


module.exports = router;

function createHistoryPerson(req, res) {
    historyService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function listHistoryPeople(req, res) {

    historyService.list()
        .then(function (history) {
            if (history) {
                res.send(history);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteHistoryPerson(req, res) {
    var historyId = req.body._id;
    historyService.delete(historyId)
        .then(function (){
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateHistoryPerson(req, res) {
    historyService.update(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

