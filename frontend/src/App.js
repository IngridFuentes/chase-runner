import React, { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./views/Home";
import Map from "./views/Map";
import styles from './styles/App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Goals from "./views/Goals";
import Profile from "./views/Profile";
import Callback from "./views/Callback";
import { useAuth0 } from "@auth0/auth0-react";
import RunningShoesSpinner from "./views/RunningShoesSpinner";

function App() {

  const { isLoading, isAuthenticated, user } = useAuth0();

  useEffect(() => {
    // This will be called when user is authenticated
    if (isAuthenticated) {
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <RunningShoesSpinner />;
  }

    return (
            <div>
              <div className={styles.mainContainer} >
                  <Routes>
                      <Route path="/callback" element={<Callback />} />
                      <Route path="/" element={isAuthenticated ? <Navigate to="/map" /> : <Home />} />
                      <Route path="/map" element={isAuthenticated ? <Map /> : <Navigate to="/" />} />
                      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
                      <Route path="/goals" element={isAuthenticated ? <Goals /> : <Navigate to="/" />} />
                  </Routes>
              </div>
              <div className={styles.footer}>
              </div>
            </div>
    );
  }

export default App;
