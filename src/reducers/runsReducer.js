const runsReducer = (state = [], action) => {
    switch(action.type) {
        case "ADD_RUNS":
            return action.payload;
            // return Array.isArray(action.payload) ? action.payload : [action.payload]
        case "ADD_RUN":
            return state.concat(action.runApplication);
        case "UPDATE_RUN":
            // console.log("this is ...", action)
            return state.map( run => run.id === action.runApplication.id ? action.runApplication : run )
        case "DELETE_RUN":
            return state.filter(run => run.id !== action.runApplicationId)
        case "CLEAR_MY_RUN":
            return []
        default:
        return state;
    }
}

export default runsReducer;