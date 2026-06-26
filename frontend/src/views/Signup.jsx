import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styles from "../styles/Signup.module.css";

const Signup = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/map",
      },
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  };

  return (
    <>
      <button onClick={handleSignUp} className={styles.buttonSignup}>
        <span className={styles.link}> Sign Up </span>
      </button>
    </>
  );
};

export default Signup;
