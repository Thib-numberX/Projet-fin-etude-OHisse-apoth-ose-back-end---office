//= import 
// npm
import axios from 'axios';

// local


import { 
  ADD_USER,
  DELETE_USER,
  emptyUserFields,
  fetchUsers,
  FETCH_USERS,
  LOGIN,
  saveCurrentToken,
  saveCurrentUser,
  saveUsers,
  UPDATE_USER } from '../actions/users';

import { isLogged, LOGOUT } from '../actions/settings';

const axiosInstance = axios.create({
   // API url
   baseURL: 'http://0.0.0.0:8080/',
});


const userApiMiddleware = (store) => (next) => (action) => {
  
  switch (action.type) {
    case FETCH_USERS: {
      axiosInstance
        .get('api/admin/users')
        .then(
          (resp) => {
            // console.log(resp.data)
            store.dispatch(saveUsers(resp.data))
          }
        )
        .catch(
          () => {console.log('error api')},
        );
      next(action);
      break
    }
      
    case LOGIN: {
      const state = store.getState();
      const {email, password } = state.settings.login;
      // console.log(email, password);
      // we send to API password and email
      axiosInstance
        .post(
          '/api/login',
          {
            email: email,
            password: password
          },
          )
          // we recive information about user and token
          .then((response) => {
          // const { data: accès_token } = response;
          // console.log(response.data.user);
          // console.log(response.data.token.original.access_token);
          const token = response.data.token.original.access_token;
          const { user } = response.data;
          console.log(user);

          if(user.role == 'user'){
            window.alert('Il semblerait que vous ne soyez pas administrateur sur le site');
            delete axiosInstance.defaults.headers.common.Authorization;
            return
          }

          // we save token to axios
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;

          // we modify the state to inform that the use is connected
          store.dispatch(isLogged());

          // we save the user to the state user-> currentUser
          store.dispatch(saveCurrentUser(user));
          store.dispatch(saveCurrentToken(token))

          // we fetch all favorite spots
          // store.dispatch(fetchFavorites());
          // return <Navigate to="/" replace />
        })
        .catch(() => {
          console.log('oups...');
        });
        
      next(action);
      break;
    }
    case LOGOUT: {
      delete axiosInstance.defaults.headers.common.Authorization;
      next(action);
      break;
    }
    case UPDATE_USER:{
      const {
        users: {
          inputCurrentUser: {
            id,
            firstname,
            lastname,
            pseudo,
            email,
            description,
            role,
          },
        }
    } = store.getState();
    // console.log(id, firstname, lastname);
      axiosInstance
        .patch(
          `/api/admin/user/edit/${id}`,
          {
          firstname,
          lastname,
          pseudo,
          email,
          description,
          role,
          }
        )
        .then((resp) => {
          // console.log(resp)
          window.confirm(`Vous avez bien mis à jour le profil de ${firstname} ${lastname}`);
        })
        .catch((resp) => {
          // console.log(resp, 'error');
          window.alert('Erreur : la mise à jour a echoué');
        })
        next(action);
        break
      }

      case DELETE_USER: {
        axiosInstance
        .delete(
          `api/admin/user/delete/${action.id}`
        )
        .then((resp) => {
          console.log(resp);
          window.confirm(`Vous avez bien supprimé l'utilisateur`);

          // store.dispatch(emptytAfterDelete());
          store.dispatch(fetchUsers());

        })
        .catch((resp) => {
          console.log(resp)
          window.alert(`${action.firstname} ${action.lastname} n'a pas été supprimé`);
        })
        next(action);
        break;
      }
      case ADD_USER: {
        const { 
          users : {
            addUser :{
              firstname,
              lastname,
              pseudo,
              email,
              password,
              description,
              role,
              city,
              country
            },
        }
      }= store.getState();
      axiosInstance
      .post(
        'api/admin/register',
        {
          firstname,
          lastname,
          pseudo,
          email,
          password,
          description,
          role,
          city,
          country
        }
      )
      .then((resp) => {
        // console.log(resp)
        window.confirm(` ${firstname} ${lastname} a été ajouté(e)`);
        store.dispatch(emptyUserFields())
      })
      .catch((resp) => {
        // console.log(resp, 'error');
        window.alert('Erreur : l\'utilisateur n\'a pas été ajouté');
      })
      next(action);
      break
      }
      default:
      next(action);
  }

};

export default userApiMiddleware;