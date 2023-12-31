class Api {
  constructor(config) {
    this._url = config.baseUrl;
    this._headers = config.headers;
  }

  _getResponseData(res) {
    if(res.ok) {
      return res.json()
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      credentials: 'include',
      headers: this._headers,
    })
    .then(res => {
      return this._getResponseData(res)
    })
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      credentials: 'include',
      headers: this._headers,
    })
    .then(res => {
      return this._getResponseData(res)
    })
  }

  saveNewUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.activity
      })
    })
    .then(res => {
      return this._getResponseData(res)
    })
  }

  saveNewCardInfo(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.title,
        link: data.picture
      })
    })
    .then(res => {
      return this._getResponseData(res)
    })
  }

  increaseLikesQuantity(id) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: 'PUT',
      credentials: 'include',
      headers: this._headers,
    })
    .then(res => {
      return this._getResponseData(res);
    })
  }

  decreaseLikesQuantity(id) {
    return fetch(`${this._url}/cards/${id}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers,
    })
    .then(res => {
      return this._getResponseData(res)
    })
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers,
    })
  }

  updateProfileImage(link) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(res => {
      return this._getResponseData(res)
    })
  }
}

const api = new Api({
  baseUrl: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;