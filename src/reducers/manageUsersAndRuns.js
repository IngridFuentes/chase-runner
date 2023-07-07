import { combineReducers } from 'redux';

const usersReducer = (state = { 
    users: [] }, action) => {
    switch (action.type) {
        case "ADD_USER":
        return [...state, action.user];

    default:
        return state;
    }

}
const currentUserReducer = (state= null, action) => {
  switch (action.type) {
      case 'SET_CURRENT_USER':
          return action.user
      case 'CLEAR_CURRENT_USER':
          return null
      default:
          return state;
  }

}

const run_applicationsReducer = (state = {
    runs: [] }, action) => {
    switch(action.type) {
        case "ADD_RUN_APPLICATION ":
            return action.run_applications
          //   return {
          //       ...state,
          //       job_applications: action.payload};
          //   this is our new redux state
    default:
        return state;
    }
}

const reducer = combineReducers({
  users: usersReducer,
  runs: run_applicationsReducer,
  currentUser: currentUserReducer
});
export default reducer;