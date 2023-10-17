import { resetLoginForm } from "./loginForm.js"
import { fetchRuns, clearRuns } from "./fetchRuns.js"
// import CSRFToken from '../cookies';



// synchronous action creators
export const setCurrentUser = user =>  {
    return {
        type: "SET_CURRENT_USER",
        user
    }
}

export const clearCurrentUser = () => {
    return {
        type: "CLEAR_CURRENT_USER"
    }
}

// asynchronous action creators

// export const login = (credentials, history) => {
//     console.log(credentials, history, 'history')
//     return async (dispatch) => {
//         try{ 
//         const resp = await fetch('http://localhost:3000/api/v1/login', {
//             credentials: 'include',
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(credentials),
//           });
//           const user = await resp.json();
//                 if(user.error){
//                     alert(user.error)
//                 } else {
//                     dispatch({ type: 'SET_CURRENT_USER', user: user })
//                     dispatch(fetchRuns())
//                     dispatch(resetLoginForm())
//                     console.log(history, 'history')
//                     history.push('/profile')                  
//                 }
//         } catch(error){
//             console.log(error)
//         } 
//         };
// }

export const login = (credentials, navigate) => {
    // console.log(credentials)
    // return (dispatch) => {
        // fetch('/csrf_tokens')
        // .then((resp) => resp.json())
        // .then((data) => {
        // const csrfToken = data.csrfToken;
    // let token = document.querySelector('meta[name="csrf-token"]').content;
      return (dispatch) => {
        fetch('http://localhost:3000/users/sign_in', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(console.log(credentials)),
      })
    
        .then((resp) => resp.json())
        .then((user) => {
          if (user.error) {
            alert(user.error);
          } else {
            dispatch({ type: 'SET_CURRENT_USER', user: user });
            dispatch(fetchRuns());
            dispatch(resetLoginForm());
            navigate('/profile');
          }
        })
        .catch(console.log);
    };
};

export const logout = event => {
    return dispatch => {
        dispatch(clearCurrentUser())
        dispatch(clearRuns())
        return fetch('http://localhost:3000/users/sign_out', {
            credentials: "include",
            method: "DELETE"
        })
    }
}

export const getCurrentUser = () => {
    console.log("DISPATCHING GET CURRENT USER")
    return(dispatch) => {
            return fetch('http://localhost:3000/users/sign_in', {
                credentials: "include",
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(resp => {return resp.json()})
            .then(user => { 
                if(user.error){
                    alert(user.error)
                } else {
                    dispatch(setCurrentUser(user))
                }
            })

    };
}

