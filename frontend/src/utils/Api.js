import {baseUrl} from '../utils/constants';
class Api {
    constructor(url){
        this._url = url;
    }

    _getResponse(res){
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка ${res.status}`);
    }

// загружаем карточки с сервера

    getCards(){
        return fetch(`${this._url}/cards`, {
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
        })
        .then(this._getResponse)
    }

// загружаем данные о пользователе с сервера

    getUserInfo(){
        return fetch(`${this._url}/users/me`, {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(this._getResponse)
    }

// отправка данных профиля на сервер

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

// обновление аватара

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
    
// добавляем новую карточку на сервер

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

// ставим лайк на карточку

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

// удаляем лайк с карточки

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

// удаление карточки

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

// данные для отрисовки страницы

    getAllInfo(token){
        return Promise.all([this.getCards(token), this.getUserInfo(token)])
    }
// проверяем наличие лайка

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
    url: baseUrl
  })