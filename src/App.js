import React, {useEffect} from 'react';
import './App.scss';
import { connect } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import Home from './components/Home.js';
import Login from './components/Login.js';
import { getCurrentUser } from './actions/currentUser.js';
import { fetchRuns } from './actions/fetchRuns';
import NavBar from './components/NavBar.js';
import RunsContainer from './containers/RunsContainer.js';


function App(props) {

console.log(props)

  const loggedIn = true;
  
  useEffect(() => {
      props.getCurrentUser();
      props.fetchRuns();
  }, [props]);

  // const { loggedIn,  runs } = props

  return (
    <div className="App">
      {loggedIn ? <NavBar /> : <Home /> }
      {/* <MediaQuery minWidth={800}> */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={loggedIn ? <RunsContainer /> : <Home />} />
        </Routes>

      {/* </MediaQuery> */}
    </div>
  );
}
const mapStateToProps = state => {
  return ({
    loggedIn: !!state.currentUserReducer,
    runs: state.runsReducer
  })
}


export default connect(mapStateToProps, { getCurrentUser, fetchRuns }) (App);

