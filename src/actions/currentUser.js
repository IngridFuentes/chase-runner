import { resetLoginForm } from "./loginForm.js"
import { fetchRuns, clearRuns } from "./fetchRuns.js"


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

export const login = (credentials, history) => {
    console.log(credentials)
    return(dispatch) => {
           return fetch('http://localhost:3001/api/v1/login', {
                credentials: "include",
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })
            .then(resp => {return resp.json()})
            .then(user => { 
                if(user.error){
                    alert(user.error)
                } else {
                    dispatch({ type: 'SET_CURRENT_USER', user: user })
                    dispatch(fetchRuns())
                    dispatch(resetLoginForm())
                    history.push('/profile')
                    
                }
            })
            .catch(console.log)
        };
}

export const logout = event => {
    return dispatch => {
        dispatch(clearCurrentUser())
        dispatch(clearRuns())
        return fetch('http://localhost:3001/api/v1/logout', {
            credentials: "include",
            method: "DELETE"
        })
    }
}

export const getCurrentUser = () => {
    // console.log("DISPATCHING GET CURRENT USER")
    return(dispatch) => {
            return fetch('http://localhost:3001/api/v1/get_current_user', {
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

