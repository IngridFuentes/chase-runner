import React from "react";
import { Routes, Route } from 'react-router-dom';
import { PassageProvider } from "@passageidentity/passage-react";

import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Banner from "./components/Banner";
import styles from './styles/App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewRun from "./views/NewRun";
import Stats from "./views/Stats";
import Goals from "./views/Goals";
import Login from "./views/Login";
import Profile from "./views/Profile";

function App() {
    return (
        // <PassageProvider appId={process.env.REACT_APP_PASSAGE_APP_ID}>
            <div>
              {/* <Banner/> */}
              <div className={styles.mainContainer} >
                  <Routes>
                      <Route path="/" element={<Login/>}></Route>
                      <Route path="/login" element={<Home/>}></Route>
                      {/* <Route path="/profile" element={<Profile/>}></Route> */}
                      <Route path="/dashboard" element={<Dashboard/>}></Route>
                      <Route path="/newrun" element={<NewRun/>}></Route>
                      <Route path="/stats" element={<Stats/>}></Route>
                      <Route path="/goals" element={<Goals/>}></Route>
                  </Routes>
              </div>
              <div className={styles.footer}>
              </div>
            </div>
    //   </PassageProvider>
    );
  }

export default App;
