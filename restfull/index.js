const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

let app = express()

//Interpretando o que está no post
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' })); //Consegue entender independente da codificação
app.use(bodyParser.json({limit: '50mb'})); //Todos os dados que receber via post, converte em json, limite de tamanho de 50mb
app.use(expressValidator());

consign().include('routes').include('utils').into(app);
//Invoca o consign e inclui a pasta routes e utils dentro de app e passa app para os arquivos

app.listen(4000, '127.0.0.1', ()=>{ //porta 3000, IP local
    console.log("Servidor rodando")
}) 