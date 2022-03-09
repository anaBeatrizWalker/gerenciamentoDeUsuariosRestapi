let NeDB = require('nedb')
let db = new NeDB({ //criar o banco
    filename: 'users.db', //nome do arquivo
    autoload: true //assim que rodar o código, guarda
})

module.exports = app => {

    let route = app.route('/users') //assim não precisa especificar a rota em cada método

    route.get((req, res)=>{

        //Lista usuários do banco
        db.find({}).sort({name:1}).exec((err, users)=>{
        //Objeto vazio para pegar todos os dados; ordena o resultado por nome na ordem crescente (1)

            if(err){
                app.utils.erro.send(err, req, res)
            }else{
                res.statusCode = 200 
                res.setHeader('Content-Type', 'application/json')
                res.json({ 
                    users
                })
            }
        })
    })

    route.post((req, res)=>{

        if(!app.utils.validator.user(app, req, res)) return false

        db.insert(req.body, (err, user)=>{
            if(err){
                app.utils.erro.send(err, req, res)
            } else{
                res.status(200).json(user)
            }
        })
    })

    //Buscar somente um user
    let routeId = app.route('/users/:id')

    routeId.get((req, res)=>{

        db.findOne({_id:req.params.id}).exec((err, user) =>{
            if(err){
                app.utils.erro.send(err, req, res)
            } else{
                res.status(200).json(user)
            }
        })
    })

    routeId.put((req, res) => {

        if(!app.utils.validator.user(app, req, res)) return false
        
        db.update({_id:req.params.id}, req.body, err => {
            if(err){
                app.utils.erro.send(err, req, res)
            } else{
                //res.status(200).json(req.body) //retorna os dados
                res.status(200).json(Object.assign(req.params, req.body)) //retorna os dados junto com o id
            }
        })
    })

    routeId.delete((req, res) => {

        db.remove({_id:req.params.id}, {/*opções*/}, err => {
            if(err){
                app.utils.erro.send(err, req, res)
            } else{
                res.status(200).json(req.params) //só retorna o id do usuário excluido
            }
        })
    })
}