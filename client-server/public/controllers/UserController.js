class UserController{
    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate)
        this.formUpdateEl = document.getElementById(formIdUpdate)
        this.tableEl = document.getElementById(tableId)

        this.onSubmit()
        this.onEdit()
        this.selectAll()
    }
    
    onEdit(){
        //Botão Cancelar
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
        
            this.showPanelUpdate()
        })

        //Salva edição
        this.formUpdateEl.addEventListener("submit", event=> {
            event.preventDefault() //cancela a atualização de página do submit

            let btn = this.formUpdateEl.querySelector("[type=submit]")
            btn.disabled = true //impede o usuário de apertar o botão toda hora

            let values = this.getValues(this.formUpdateEl) //recupera todos os campos preenchidos do formulário

            let index = this.formUpdateEl.dataset.trIndex //pega o indice da linha, para que ela seja substituida e que crie uma linha nova

            let tr = this.tableEl.rows[index] //pega o índice da linha que será editada

            //Pega os objeto antigos (armazenados no dataset) e mescla/subscreve com o objetos novos (que serão atualizados), porém no campo o value é vazio ...
            let userOld = JSON.parse(tr.dataset.user)//objeto antigo
            let result = Object.assign({}, userOld, values)//novos valores

            //Editar foto
            this.getPhoto(this.formUpdateEl).then(
                (content)=>{

                //resolvendo o value vazio
                if(!values.photo) {
                    //mantém a foto antiga do formulário
                    result._photo = userOld._photo
                }else{
                    //recebe o conteúdo
                    result._photo = content
                }

                let user = new User()
                user.loadFromJSON(result) //tira o underline dos dados do usuário para serem usados na tabela

                //Salva no localStorage
                user.save()

                this.getTr(user, tr)
                
                this.updateCount()

                //habilita o botao e limpa o form
                btn.disabled = false
                this.formUpdateEl.reset()
                this.showPanelCreate()
            })
        })
    }

    //Quando enviar
    onSubmit(){
        this.formEl.addEventListener("submit", event =>{//arrowFunction evita conflito de escopo do this.getValues()
            //event pega todas as informações sobre o evento chamado
            event.preventDefault() //cancela a atualização de página do submit 

            //trava o botão para não enviar o mesmo usuario varias vezes
            let btn = this.formEl.querySelector("[type=submit]")
            btn.disabled = true

            let values = this.getValues(this.formEl)

            //se value for falso, cancela o envio do form
            if(!values) return false //corrige o problema da foto ser entendida como booleano por conta do isValid

            this.getPhoto(this.formEl).then(
                (content)=>{
                //quando der certo
                values.photo = content

                //Salva no localStorage
                values.save()

                this.addLine(values) 
                
                //limpa o form e ativa o botão
                this.formEl.reset()
                btn.disabled = false

            }, (e)=>{
                //quando der erro
                console.error(e)
            })
        })
    }

    getPhoto(formEl){
        return new Promise((resolve, reject)=>{
            let fileReader = new FileReader();

            let elements = [...formEl.elements].filter(item =>{
                if (item.name === 'photo'){//filter retorna apenas as fotos e retorna o arquivo
                    return item
                }
            })
            let file = elements[0].files[0]//da 1º coleção de elementos, pegue o 1º arquivo

            //quando terminar a leitura da imagem
            fileReader.onload = () =>{
                
                resolve(fileReader.result)
            }
            fileReader.onerror = (e)=>{
                reject(e)
            }
            //se tem um arquivo, renderiza
            if(file){
                fileReader.readAsDataURL(file) 
            //se não, renderiza img padrão
            }else{
                resolve('dist/img/boxed-bg.jpg')//resolve para que o envio de arquivo não seja obrigatório
            }
        })
        
    }

    getValues(formEl){

        let user = {};
        let isValid = true;

        //elements substitui o fields (prop do objeto de form)
        [...formEl.elements].forEach(function(field, index){

            //se o indexOf do array é > -1, ou seja, encontrou os campos E eles não estão vazios
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
    
                field.parentElement.classList.add('has-error')//acessa o elemento pai, pega a coleção de classes, add +1 classe 'has-error'

                isValid = false //form não tá válido
            }

            if(field.name == 'gender'){
                if(field.checked){ //(field.checked === true)
                    user[field.name] = field.value
                }
            }else if(field.name == 'admin'){
                user[field.name] = field.checked
            }else{
                user[field.name] = field.value
            }
        })
        //form continua válido?
        if(!isValid){
            return false
        }
        return new User(
            user.name, 
            user.email, 
            user.gender, 
            user.birth, 
            user.country, 
            user.password, 
            user.photo, 
            user.admin
        )
    }

    //Lista os dados que já estão no localStorage
    selectAll(){
        let users = User.getUsersStorage()

        users.forEach(dataUser => {

            let user = new User() //instância dos usuários pra poder funcionar no addLine

            user.loadFromJSON(dataUser)//carrega de um json
            
            this.addLine(user)
        })
    } 

    addLine(dataUser){
        //Chama a tr criada com os dados do usuário
        let tr = this.getTr(dataUser)

        //Coloca a tr criada como filho de table
        this.tableEl.appendChild(tr)

        //Assim que adicionar uma nova linha (table), atualiza a quantidade de usuários
        this.updateCount()
    }

    getTr(dataUser, tr = null){// tr = null, parametro não obrigatório. Para quando a tr não existir e o 1º cadastro for feito

        if(tr === null) tr = document.createElement("tr")

        //Guarda cada valor do tr no dataset; user é uma var; json converteu de objeto para string
        tr.dataset.user = JSON.stringify(dataUser)

        tr.innerHTML =  `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin)?'Sim':'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `
        this.addEventsTR(tr)
        
        return tr
    }

    addEventsTR(tr){
        //Botão Excluir
        tr.querySelector(".btn-delete").addEventListener('click', e=>{
            if(confirm("Deseja realmente excluir?")){

                let user = new User()
                user.loadFromJSON(JSON.parse(tr.dataset.user))

                user.remove()//método do Users.js, remove do localStorage
                
                tr.remove()//comando html, remove da tela a linha tr do usuário

                this.updateCount()//assim que remove, atualiza as estatísticas
            }
        })

        //Botão Editar
        tr.querySelector(".btn-edit").addEventListener('click', e=>{
    
            let json = JSON.parse(tr.dataset.user)

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex

            //Percorre cada campo que tenha como nome a propriedade do json 
            for(let name in json){
                let field = this.formUpdateEl.querySelector("[name= "+ name.replace("_", "") +"]")

                if(field){ //o campo existe?

                    switch(field.type){ //analisa o tipo dos campos
                        case 'file':
                            continue;
                            break; //se for file, apenas continue e não faça nada
                        
                        case 'radio':
                            //localiza se o value é M ou F
                            field = this.formUpdateEl.querySelector("[name= "+ name.replace("_", "") +"][value="+json[name]+"]")
                            field.checked = true
                            break; 

                        case 'checkbox':
                            //se for checkbox, pega o name checkado
                            field.checked = json[name]
                            break;

                        default:
                            field.value = json[name]
                    }
                }               
            }
            this.formUpdateEl.querySelector('.photo').src = json._photo

            this.showPanelUpdate()
            
        })
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block"
        document.querySelector("#box-user-update").style.display = "none"
    }
    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none"
        document.querySelector("#box-user-update").style.display = "block"
    }

    //Atualiza a quantidade de usuários
    updateCount(){
        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr=>{

            numberUsers++ //incrementa mais um para cada elemento encontrado

            let user = JSON.parse(tr.dataset.user) //converte para objeto denovo

            if(user._admin) numberAdmin++ //a conversão de json não continua a instância de admin, por isso devemos chamar ele novamente com underline
        })
        //renderiza o resultado
        document.querySelector("#number-users").innerHTML = numberUsers
        document.querySelector("#number-users-admin").innerHTML = numberAdmin
    }
}