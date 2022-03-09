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
                    this[name] = json[name]
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
    
    save(){
        let users = User.getUsersStorage()

        //se o id existe
        if(this.id > 0){
            //editar o usuário
            users.map(u => {

                if(u._id == this.id){ //se o id for igual ao id do usuário a ser editado pega o objeto do usuário e substitui o que tiver que substituir
                    
                    Object.assign(u, this) //compara os dois e "atualiza" como o que veio do this 
                }
                return u
            })

        } else{
            //se não existe, gera um novo
            this._id = this.getNewId()

            users.push(this)
        }
        localStorage.setItem("user", JSON.stringify(users))
    }

    remove(){
        let users = User.getUsersStorage() //array de usuários

        users.forEach((userData, index)=>{ //recebe os dados e a posição deles

            if(this._id == userData._id){ //encontra o usuário que quer excluir

                users.splice(index, 1) //splice elimina(indice do elemento, quantos irá remover)
            }
        })
        localStorage.setItem("user",JSON.stringify(users))
        //removeItem remove a chave do localeStorage, poderia ser usado para remover todos os usuários
    }
}