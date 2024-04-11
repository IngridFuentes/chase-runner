import React from "react";
import { Routes, Route } from 'react-router-dom';
import { PassageProvider } from "@passageidentity/passage-react";

import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Map from "./views/Map";
import styles from './styles/App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewRun from "./views/NewRun";
import Stats from "./views/Stats";
import Goals from "./views/Goals";
import Login from "./views/Login";
import Signup from "./views/Signup";
import Profile from "./views/Profile";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated } = useAuth0();

    return (
        // <PassageProvider appId={process.env.REACT_APP_PASSAGE_APP_ID}>
            <div>
              <div className={styles.mainContainer} >
                  <Routes>
                      <Route path="/" element={<Home/>}></Route>
                      <Route path="/login" element={<Login/>}></Route>
                      <Route path="/signup" element={<Signup/>}></Route>
                      {/* <Route path="/profile" element={<Profile/>}></Route> */}
                      <Route path="/map" element={<Map />} > </Route>
                      <Route path="/newrun" element={<NewRun/>}></Route>
                      <Route path="/stats" element={<Stats/>}></Route>
                      <Route path="/goals" element={<Goals/>}></Route>
                  </Routes>
              </div>
              <div className={styles.footer}>
              </div>
            </div>
      // </PassageProvider>
    );
  }

export default App;
