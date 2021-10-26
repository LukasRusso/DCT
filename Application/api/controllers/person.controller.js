const { response } = require('express');
var express = require('express');
var router = express.Router();
var person = require('services/person.service');

// routes
router.post('/', createPerson);
router.get('/', getPerson);
router.put('/', updatePerson);
router.delete('/', deletePerson)

module.exports = router;

function createPerson(req, res) {
    person.createPerson(req.body)
        .then(function () {
            res.sendStatus(201);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getPerson(req, res){
    if(Object.keys(req.query).includes("_id"))
    {
        person.getPersonById(req.query)
        .then(function (person) {
            if (person) {
                res.send(person);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
    }
    else {
        listPerson(req, res);
    }
}

function listPerson(req, res) {       
    person.listPerson()
    .then(function (person) {
        if (person) {
            res.send(person);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    }); 
}

function updatePerson(req, res) {
    person.updatePerson(req.body)
        .then(function (){
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletePerson(req, res) {   
    person._deleteUser(req.body)
        .then(function (resp) {
            if(resp)
                res.status(404).send(resp);
            else
                res.sendStatus(204);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
