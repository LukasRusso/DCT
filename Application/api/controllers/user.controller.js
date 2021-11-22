var express = require('express')
var router = express.Router()
var user = require('../services/user.service')

// routes
router.post('/', createUser)
router.get('/', loginUser)
router.put('/', updateUser)
router.delete('/', deleteUser)
router.post('/authenticate', authenticateUser);

module.exports = router

function createUser(req, res) {
  user
    .createUser(req.body)
    .then(function () {
      res.sendStatus(201)
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}

function authenticateUser(req, res) {
  user.authenticate(req.body.email, req.body.senha)
      .then(function (response) {
          if (response) {
              // authentication successful
              res.send({ userId: response.userId, token: response.token });
          } else {
              // authentication failed
              res.status(401).send('Usuário e/ou senha inválidos');
          }
      })
      .catch(function (err) {
          res.status(400).send(err);
      });
}

function loginUser(req, res) {
  user.loginUser(req.query)
    .then(function (login) {
      if (login) {
        res.send(login)
        res.sendStatus(200)
      } else {
        res.sendStatus(404)
      }
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}

function updateUser(req, res) {
  user
    .updateUser(req.body)
    .then(function () {
      res.sendStatus(200)
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}

function deleteUser(req, res) {
  user
    .deleteUser(req.body)
    .then(function (resp) {
      if (resp) res.status(404).send(resp)
      else res.sendStatus(204)
    })
    .catch(function (err) {
      res.status(400).send(err)
    })
}
