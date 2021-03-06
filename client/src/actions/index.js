import axios from 'axios';

export function getGames(limit = 10, start = 0, order = 'asc', list = '') {
	const request = axios
		.get(`/api/games?limit=${limit}&skip=${start}&order=${order}`)
		.then(response => {
			if (list) {
				return [...list, ...response.data];
			} else {
				return response.data;
			}
		});

	return {
		type: 'GET_GAMES',
		payload: request
	};
}

export function getGameWithReviewer(id) {
	const request = axios.get(`/api/getGame?id=${id}`);

	return dispatch => {
		request.then(response => {
			let game = response.data;

			axios.get(`/api/getReviewer?id=${game.ownerId}`).then(response => {
				let gameData = {
					game,
					reviewer: response.data
				};
				dispatch({
					type: 'GET_GAME_W_REVIEWER',
					payload: gameData
				});
			});
		});
	};
}

export function clearGamePage() {
	return {
		type: 'CLEAR_GAME_PAGE',
		payload: {
			game: {},
			reviewer: {}
		}
	};
}

// USERS

export function loginUser({ email, password }) {
	const request = axios.post('/api/login', { email, password })
		.then(response => response.data);
	return {
		type: 'USER_LOGIN',
		payload: request
	};
}

export function auth() {
	const request = axios.get('/api/auth').then(response => response.data);

	return {
		type: 'USER_AUTH',
		payload: request
	};
}

export function getUsers(){
  const request = axios.get('/api/users').then(response => response.data);
  return {
    type: 'GET_USERS',
    payload: request
  }
}

export function registerUser(user, userList){
  const request = axios.post(`/api/register`, user)

  return(dispatch) => {
    request.then((response) => {
      let users = response.data.success ? [...userList, response.data.user] : userList; 
      let registerData = {
        success: response.data.success,
        users
      }
      dispatch({
        type: 'USER_REGISTER',
        payload: registerData
      })
    })
  }
}

// ADD BOOK
export function addGame(game) {
	const request = axios.post('/api/game', game).then(response => response.data);

	return {
		type: 'ADD_GAME',
		payload: request
	};
}

export function clearNewGame() {
	return {
		type: 'CLEAR_NEWGAME',
		payload: {}
	};
}

// EDIT BOOK
export function getGame(id){
  const request = axios.get(`/api/getGame?id=${id}`)
  .then(response => response.data)
  return {
    type: 'GET_GAME',
    payload: request
  }
}

export function updateGame(data){
  const request = axios.post(`/api/game_update`, data).then(response => response.data)
  return {
    type: 'UPDATE_GAME',
    payload: request
  }
}

export function deleteGame(id) {
  const request = axios.delete(`/api/game_delete?id=${id}`).then(response => response.data)
  return {
    type: 'DELETE_GAME',
    payload: request
  }
}

export function clearGame() {
  return {
    type: 'CLEAR_GAME',
    payload: {
      game: null,
      updateGame: false,
      postDeleted: false
    }
  }
}

// ALL USER REVIEWS
export function getUserReviews(userId){
  const request = axios.get(`/api/user_posts?user=${userId}`).then(response => response.data)
  return {
    type: 'GET_USER_REVIEWS',
    payload: request
  }
}


