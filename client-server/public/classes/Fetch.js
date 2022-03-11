class Fecth {

    static get(url, params = {}){
        return Fecth.request('GET', url, params)
    }
    static delete(url, params = {}){
        return Fecth.request('DELETE', url, params)
    }
    static put(url, params = {}){
        return Fecth.request('PUT', url, params)
    }
    static post(url, params = {}){
        return Fecth.request('POST', url, params)
    }

    static request(method, url, params = {}){

        let request;

        return new Promise((resolve, reject)=>{

            switch(method.toLowerCase()){
                
                case 'get':
                    request = url
                break;

                default:
                    request = new Request(url, {
                        method,
                        body: JSON.stringify(params),
                        headers: new Headers({'Content-Type': 'application/json'})
                    })
            }
            
            fetch(request).then(response => {
                response.json().then(json => {
                    resolve(json)
                }).catch(e => {
                    reject(e)
                })
            }).catch(e => {
                reject(e)
            })
        })
    }
}