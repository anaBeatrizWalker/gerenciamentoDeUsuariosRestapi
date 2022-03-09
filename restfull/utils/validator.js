module.exports = {
    user: (app, req, res)=>{
        //Verifica os campos do body (nome do campo, mensagem de erro)
        req.assert('_name', 'O nome é obrigatório.').notEmpty();
        req.assert('_email', 'O e-mail está inválido.').notEmpty().isEmail();

        let errors = req.validationErrors();
        if(errors){
            //Mostra os erros na tela
            app.utils.erro.send(errors, req, res)
            //Para a execução da página
            return false

        }else{
            return true
        }
    }
}