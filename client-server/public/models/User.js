//Toda classe começa com letra maiúscula
class User{  
    constructor(name, email, gender, birth, country, password, photo, admin){
        //this.atributo = variável do parâmetro
        //Inicializando os valores para serem usados em métodos dentro da classe
        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date()
    }
    //Métodos que retornam a propriedade corretamente

    get id(){
        return this._id
    }

    get register(){
        return this._register
    }

    get name(){
        return this._name
    }

    get email(){
        return this._email
    }

    get gender(){
        return this._gender
    }

    get birth(){
        return this._birth
    }

    get country(){
        return this._country
    }

    get password(){
        return this._password
    }

    get photo(){
        return this._photo
    }

    get admin(){
        return this._admin
    } 
    
    //Método de alterar a propriedade corretamente
    set photo(value){
        this._photo = value
    }

    loadFromJSON(json){
        for(let name in json){ //pra cada name que encontrar no json
            switch(name){
                case '_register': //convertendo a data para um objeto
                    this[name] = new Date(json[name])
                break;

                default:
                    //Se a substring começando do index 0, no primeiro caractere começar com _
                    if(name.substring(0, 1) === '_') this[name] = json[name]
            }
        }
    }
    
    static getUsersStorage(){
        let users = []
        //se tem algo no localStorage
        if(localStorage.getItem("user")){
            //sobrescreve
            users = JSON.parse(localStorage.getItem("user"))
        }
        return users
    }

    //Cria um id, para registrar unicamente cada usuário
    getNewId(){

        let userId = parseInt(localStorage.getItem("userId"))

        if(!userId > 0) userId = 0 //se não existe, cria um que recebe zero

        userId++ //pega o existente e soma mais um

        localStorage.setItem("userId", userId) //sempre que gerar um novo id, armazena o último no localS

        return userId
    }

    toJSON(){
        let json = {}
        //Pega as chaves/atributos do objeto
        Object.keys(this).forEach(key => {
            if(this[key] !== undefined) json[key] = this[key]
        })
        return json
    }
    
    save(){

        return new Promise((resolve, reject) => {
            let promise
            if(this.id){
                //Editar
                promise = HttpRequest.put(`/users/${this.id}`, this.toJSON())
            }else{
                //Cadastrar
                promise = HttpRequest.post(`/users/`, this.toJSON())
            }
            //Carrega e atualiza os dados
            promise.then(data => {
                this.loadFromJSON(data)
                resolve(this)
            }).catch(e => {
                reject(e)
            })
        })
    }

    remove(){

        return HttpRequest.delete(`/users/${this.id}`)
    }
}