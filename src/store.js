import { configureStore } from '@reduxjs/toolkit'
import runsReducer from "./reducers/runsReducer"
import currentUserReducer from "./reducers/currentUser"
import loginForm from "./reducers/loginForm"
import newRunApplication from "./reducers/newRunApplication"


const store = configureStore({
        reducer: {
                runsReducer,
                currentUserReducer,
                loginForm,
                newRunApplication
        }
})

export default store;