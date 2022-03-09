var express = require('express');
var restify = require('restify-clients');
var assert = require('assert');
var router = express.Router();

//Creates a JSON client
var client = restify.createJsonClient({
  url: 'http://localhost:4000' //endereço do servidor. Declara onde está o serviço
})

/* GET users listing. */
router.get('/', function(req, res, next) {

  //Monta o link completo com /users. Mostra a rota
  client.get('/users', function(err, request, response, obj){
    assert.ifError(err)
    //Joga na tela
    res.end(JSON.stringify(obj, null, 2))
  })
});

module.exports = router;