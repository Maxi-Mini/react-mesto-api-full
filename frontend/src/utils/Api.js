

class Api {
    constructor(config){
        this._url = config.url;
    }

    _getResponse(res){
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка ${res.status}`);
    }

    getCards(){
        return fetch(`${this._url}/cards`, {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
        })
        .then(this._getResponse)
    }

    getUserInfo(){
        return fetch(`${this._url}/users/me`, {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(this._getResponse)
    }

    setUserInfo(data){
        return fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name: data.name,
                about: data.description
              })
        })
        .then(this._getResponse)
    }

    setUserAvatar(data){
        return fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(data)
        })
        .then(this._getResponse)
    }
    

    postCard(data){
        console.log(data)
        return fetch(`${this._url}/cards`, {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name: data.title,
                link: data.link
              })
        })
        .then(this._getResponse)
    }

    setLike(data){
        return fetch(`${this._url}/cards/likes/${data}`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(this._getResponse)
    }

    deleteLike(data){
        return fetch(`${this._url}/cards/likes/${data}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(this._getResponse)
    }

    deleteCard(data){
        return fetch(`${this._url}/cards/${data}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(this._getResponse)
    }

    getAllInfo(){
        return Promise.all([this.getCards(), this.getUserInfo()])
    }

    changeLikeCardStatus(data, isLiked) {
        console.log(data);
        return fetch(`${this._url}/cards/likes/${data}`, {
          method: `${isLiked ? 'DELETE' : 'PUT'}`,
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        })
          .then(this._getResponse);
      }
}

export const api = new Api({
    url: 'https://maxi.backend.nomoredomains.work',
  })