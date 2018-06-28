var express = require('express');
var router = express.Router();
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

router.get('/', function(req, res, next) {

  database.raw('SELECT * FROM secrets').
  then(function(secret) {
    if(!secret.rows) {
      return res.sendStatus(404);
    } else {
     return res.json(secret.rows);
    }
  })
});

router.get('/:id', function(req, res, next) {
  var id = req.params.id

  database.raw('SELECT * FROM secrets WHERE id=?', [id]).
  then(function(secret) {
    if(!secret.rows) {
      return res.sendStatus(404);
    } else {
     return res.json(secret.rows);
    }
  })
});

router.post('/', function(req, res, next) {
  var body = req.body.message

  if(!body) {
    return res.status(422).send({
      error: "No message property provided"
    })
  } else {
    database.raw('INSERT INTO secrets (message, created_at) VALUES (?,?) RETURNING *', [body, new Date]).
    then(function(secret) {
      res.status(201).json(secret.rows[0])
    })
  }
})

module.exports = router;
