import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Banner from "./components/banner";
import styles from './styles/App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewRun from "./views/NewRun";
import Stats from "./views/Stats";
import Goals from "./views/Goals";

function App() {
    return (
        <div>
              <Banner/>
              <div className={styles.mainContainer}>
                  <Routes>
                      <Route path="/" element={<Home/>}></Route>
                      <Route path="/dashboard" element={<Dashboard/>}></Route>
                      <Route path="/newrun" element={<NewRun/>}></Route>
                      <Route path="/stats" element={<Stats/>}></Route>
                      <Route path="/goals" element={<Goals/>}></Route>
                  </Routes>
              </div>
              <div className={styles.footer}>
                  Learn more with our <a href="https://docs.passage.id">Documentation</a> and <a href="https://github.com/passageidentity">Github</a>.      
              </div>
        </div>
    );
  }

export default App;
