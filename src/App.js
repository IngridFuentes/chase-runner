import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Banner from "./components/banner";
import styles from './styles/App.module.css';
<<<<<<< HEAD
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div>
              <Banner/>
              <div className={styles.mainContainer}>
                  <Routes>
                      <Route path="/" element={<Home/>}></Route>
                      <Route path="/dashboard" element={<Dashboard/>}></Route>
                  </Routes>
              </div>
              <div className={styles.footer}>
                  Learn more with our <a href="https://docs.passage.id">Documentation</a> and <a href="https://github.com/passageidentity">Github</a>.      
              </div>
        </div>
    );
  }
=======

function App() {
  return (
      <div>
            <Banner/>
            <div className={styles.mainContainer}>
                <Routes>
                    <Route path="/" element={<Home/>}></Route>
                    <Route path="/dashboard" element={<Dashboard/>}></Route>
                </Routes>
            </div>
            <div className={styles.footer}>
                Chase Runner    
            </div>
      </div>
  );
}
>>>>>>> 4ed30e5721e21fa7f0ba6b89df04b0f07f401fe3

export default App;
