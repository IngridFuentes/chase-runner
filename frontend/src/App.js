import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import Home from './components/Home.js';
import Login from './components/Login.js';
import { getCurrentUser } from './actions/currentUser.js';
import { fetchRuns } from './actions/fetchRuns';
import NavBar from './components/NavBar.js';
import RunsContainer from './containers/RunsContainer.js';
import RunCard from './components/RunCard';
import NewRunFormContainer from './containers/NewRunFormContainer';


function App() {

  const loggedIn = useSelector(state => !!state.currentUserReducer);
  const runs = useSelector(state => state.runsReducer);
  const dispatch = useDispatch();

  
  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchRuns());
  }, [dispatch]);

  return (

    <div className="App">
      {loggedIn ? <NavBar /> : <Home /> }
      {/* <MediaQuery minWidth={800}> */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={loggedIn ? <RunsContainer /> : <Home />} />
          <Route exact path="/applications/new" element={<NewRunFormContainer />} />
        </Routes>

      {/* </MediaQuery> */}
    </div>
  );
}

export default App;

