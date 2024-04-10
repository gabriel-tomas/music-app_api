# Music App (backend)
API Rest para o front do [Music App](https://github.com/gabriel-tomas/music-app)

Backend feito para o gerenciamento das contas dos usuários e os favoritos dos usuários.

A autenticação dos usuários é feito por meio de JWTs, esse JWT é guardado no front e enviando para o back sempre que alguma requisição fechada (requisição que necessita de auth) é feita.

O projeto usa o MongoDB no banco de dados para armazenar os usuários e playlists.

## Rotas

🟨 = rota fechada, necessário token

Mude a url e porta para a sua

### Register

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | /register | Criação do usuário |

O primeiro JWT do usuário é gerado aqui.

O JWT expira, dai o usuário tem que logar-se novamente

#### Exemplos de uso

- `POST` /register

```javascript
const options = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: '{"username": "USERNAME", "email": "EMAIL", "password": "USERPASSWORD"}'
}

fetch('http://localhost:3000/register', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### Login

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | /login | Login do usuário |

O JWT é gerado novamente aqui

#### Exemplos de uso

- `POST` /login

```javascript
const options = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: '{"email": "EMAIL", "password": "USERPASSWORD"}'
}

fetch('http://localhost:3000/login', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```


### User

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | /user 🟨  | Ver dados de um usuário |
| `PUT` | /user 🟨  | Atualiza dados de um usuário |
| `DELETE` | /user 🟨  | Deleta um usuário do DB |

#### Exemplos de uso

- `GET` /user ou `DELETE` /user

```javascript
const options = {
  method: 'GET', // < usar DELETE vai deleter o usuário
  headers: {
    Authorization: 'Bearer Token.........'
  }
};

fetch('http://localhost:3000/user', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

- `PUT` /user

```javascript
const options = {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer Token.........'
  },
  body: '{"username":"USERNAME","email":"USEREMAIL","password":"USERPASSWORD"}'
};

fetch('http://localhost:3000/user', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

### Playlists

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | /playlists 🟨  | Ver todas as playlists do usuário |
| `GET` | /playlists/:playlistName 🟨  | Mostra uma playlist do usuário |
| `POST` | /playlists/create 🟨  | Cria uma playlist vázia |
| `DELETE` | /playlists/delete 🟨  | Deleta uma playlist |
| `PATCH` | /playlists/edit 🟨  | Edita o nome de uma playlist |
| `PATCH` | /playlists/add 🟨  | Adiciona uma track a uma playlist |
| `PATCH` | /playlists/remove 🟨  | Remove uma track de uma playlist |

#### Exemplos de uso

- `GET` /playlists

```javascript
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer Token.........'
  }
};

fetch('http://localhost:3000/playlists', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

- `GET` /playlists/:playlistName

```javascript
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer Token.........'
  }
};

fetch('http://localhost:3000/playlists/nomeDaPlaylist', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

- `POST` /playlists/create

```javascript
const options = {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer Token.........'
  },
  body: '{"playlistName":"nomeDaNovaPlaylist"}'
};

fetch('http://localhost:3000/playlists/create', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

- `DELETE` /playlists/delete

```javascript
const options = {
  method: 'DELETE',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer Token.........'
  },
  body: '{"playlistName":"playlistParaSerRemovida"}'
};

fetch('http://localhost:3000/playlists/delete', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

- `PATCH` /playlists/edit

```javascript
const options = {
  method: 'PATCH',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer Token.........'
  },
  body: '{"playlistName":"nomePlaylistJaCriada","newPlaylistName":"novoNomeDaPlaylist"}'
};

fetch('http://localhost:3000/playlists/edit', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

- `PATCH` /playlists/add

```javascript
const options = {
  method: 'PATCH',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer Token.........'
  },
  body: '{"playlistName":"nomeDaPlaylist","track": {"id":"UNIQUE_ID"}}'
};

fetch('http://localhost:3002/playlists/add', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```

Para adicionar tracks a uma playlist você pode adicionar seguindo o padrão do Spotify: https://developer.spotify.com/documentation/web-api/reference/get-track

Mas é permitido adicionar somente um objeto com um id (id é necessário para posteriormente remover essa track ou seja lá o que for)

- `PATCH` /playlists/remove

```javascript
const options = {
  method: 'PATCH',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer Token.........'
  },
  body: '{"playlistName":"nomeDaPlaylist","trackId":"OBJECT_UNIQUE_ID"}'
};

fetch('http://localhost:3000/playlists/remove', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
```
