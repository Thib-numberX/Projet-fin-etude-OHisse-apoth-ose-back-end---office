//= import 
// npm
import axios from 'axios';
import { useSelector } from 'react-redux';

// local
import { ADD_SPOT, DELETE_SPOT, emptyfield, fetchSpots, FETCH_SPOTS, saveSpots, UPDATE_SPOT } from '../actions/spots';


const axiosInstance = axios.create({
   // API url
   baseURL: 'http://0.0.0.0:8080/',
});


const spotApiMiddleware = (store) => (next) => (action) => {
  const state = store.getState();
  const token =  state.users.tokenCurrentUser;
  // console.log(token);
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      
  switch (action.type) {

    case FETCH_SPOTS:{
      // console.log(token);
      axiosInstance
        .get('api/admin/spots')
        .then(
          (resp) => {
            // console.log(resp.data)
            store.dispatch(saveSpots(resp.data))
          }
        )
        .catch(
          () => console.log('error api'),
        );
      next(action);
      break;
}
    case UPDATE_SPOT:{
      const {
        spots: {
          inputCurrentSpot: {
            id,
            name,
            number,
            street,
            zipcode,
            city,
            country,
            type,
            rock_type,
            discipline,
            latitude,
            longitude,
            min_difficulty,
            max_difficulty,
            various,
            reputation,
            picture,
          },
        }
    } =store.getState();
      // console.log(id, name);
        axiosInstance
          .patch(
            `/api/admin/spots/edit/${id}`,
            {
              id,
              name,
              number,
              street,
              zipcode,
              city,
              country,
              type,
              rock_type,
              discipline,
              latitude : longitude,
              longitude : latitude,
              min_difficulty,
              max_difficulty,
              various,
              reputation,
              picture,
            }
          )
          .then((resp) => {
            // console.log(resp)
            window.confirm(`Vous avez bien mis ?? jour le spot ${name} ?? ${city}`);
          })
          .catch((resp) =>{
            // console.log(resp, 'error');
            window.alert('Erreur : la mise ?? jour a echou??');
          })
          next(action);
          break
    }
    case DELETE_SPOT: {
      axiosInstance
      .delete(
        `api/admin/spots/delete/${action.id}`
      )
      .then((resp) => {
        // console.log(resp);
        window.confirm(`Vous avez bien supprim?? le spot`);
        store.dispatch(fetchSpots());
      })
      .catch((resp) => {
        // console.log(resp);
        window.alert(`${action.city} n'a pas ??t?? supprim??`);
      })
      next(action)
      break
    }

    case ADD_SPOT: {
      const { 
        spots: {
        addSpot: {
          name,
          number,
          street,
          zipcode,
          city,
          country,
          type,
          rock_type,
          discipline,
          latitude,
          longitude,
          min_difficulty,
          max_difficulty,
          various,
          reputation,
          picture,
        },
      }
    } = store.getState();
    // console.log( name,
    //   number, street, zipcode, city, country, type, rock_type, discipline,
    //   latitude, longitude, min_difficulty, max_difficulty, various, reputation,
    //   picture,);
      axiosInstance
      .post(
        'api/admin/spots/create',
        {
          name,
          number,
          street,
          zipcode,
          city,
          country,
          type,
          rock_type,
          discipline,
          latitude: longitude,
          longitude : latitude,
          min_difficulty,
          max_difficulty,
          various,
          reputation,
          picture,
        }
      )
      .then((resp) => {
        // console.log(resp);
        window.confirm(`Vous avez bien ajout?? le spot ${name}`);
        store.dispatch(fetchSpots());
        store.dispatch(emptyfield())
      })
      .catch ((resp) => {
        // console.log(resp);
        window.alert(`Erreur : le spot n'a pas ??t?? ajout??`);
      })
      next(action)
      break
    }
    
      default:
      next(action);
  }
};

export default spotApiMiddleware;