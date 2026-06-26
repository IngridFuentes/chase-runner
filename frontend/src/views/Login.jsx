
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { useEffect } from "react";
import styles from "../styles/Login.module.css";
import { useNavigate } from "react-router-dom";
import RunningShoesSpinner from "./RunningShoesSpinner";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated and redirect them
    if (isAuthenticated) {
      console.log("User is authenticated:", user);
      setIsLoggingIn(true);
      navigate("/map");
    }
  }, [isAuthenticated, navigate, user]);

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/map",
      },
    });
  };

  if (isLoading || isLoggingIn) {
    console.log("load??");
    return <RunningShoesSpinner />;
  }

  return (
    <>
      <button className={styles.buttonLogin} onClick={handleLogin}>
        <span className={styles.link}> Login </span>
      </button>
    </>
  );
};
export default Login;

