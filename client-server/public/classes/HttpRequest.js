class HttpRequest {

    static get(url, params = {}){
        return HttpRequest.request('GET', url, params)
    }
    static delete(url, params = {}){
        return HttpRequest.request('DELETE', url, params)
    }
    static put(url, params = {}){
        return HttpRequest.request('PUT', url, params)
    }
    static post(url, params = {}){
        return HttpRequest.request('POST', url, params)
    }

    static request(method, url, params = {}){

        return new Promise((resolve, reject)=>{
            let ajax = new XMLHttpRequest();

            //Método e rota
            ajax.open(method.toUpperCase(), url)

            ajax.onerror = e => {
                reject(e)
            }

            //Evento de resposta: quando conseguiu carregar retorna as infos do servidor
            ajax.onload = event => {

                let obj = {}

                try {
                    obj = JSON.parse(ajax.responseText)
                }catch(e){
                    //se não for um json válido, retorna um erro
                    reject(e)
                    console.error(e)
                }
                resolve(obj)
            }   
            //Definindo o cabeçalho
            ajax.setRequestHeader('Content-Type', 'application/json')
            //Carregou, chama a solicitação
            ajax.send(JSON.stringify(params)) //ajax só entende string
        })
    }
}