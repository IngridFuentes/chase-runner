export const fetchUsers = () =>  {
    return(dispatch) => {
        dispatch({type: 'LOADING_USERS'});
        fetch('http://localhost:3000/users')
        .then(resp => {return resp.json()})
        .then(users => { dispatch({ type: 'ADD_USER', payload: users})} );
    };
}

