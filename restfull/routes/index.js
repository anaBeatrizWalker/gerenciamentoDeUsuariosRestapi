module.exports = (app)=>{

    app.get('/',(req, res)=> {

        res.statusCode = 200 //O que acontece com a conexão
        res.setHeader('Content-Type', 'text/html') //Especifica o cabeçalho, para ter certeza que é um html e processa o texto em html
        res.end("<h1>Olá</h1>") //Resposta
    })
}