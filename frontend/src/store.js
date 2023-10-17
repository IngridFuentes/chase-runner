import { configureStore} from '@reduxjs/toolkit'
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history'
import { connectRouter, routerMiddleware } from 'connected-react-router';
import runsReducer from './reducers/runsReducer'
import currentUserReducer from './reducers/currentUser'
import loginForm from './reducers/loginForm'
import newRunApplication from './reducers/newRunApplication'

const history = createBrowserHistory();

const store = configureStore({
        reducer: {
                router: connectRouter(history),
                runsReducer,
                currentUserReducer,
                loginForm,
                newRunApplication
        },
        middleware: [routerMiddleware(history), thunk],
});

export { history };
export default store;