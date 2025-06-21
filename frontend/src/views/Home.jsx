import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <img src="/runnerLogo.jpg" alt="Chase Runner Logo" className={styles.logo} />
      <h1 className={styles.welcomeText}>Welcome to Chase Runner</h1>
      <p className={styles.subtitle}>Track your runs across the USA</p>
     
      <div className={styles.buttonGroup}>
        <Login />
        <Signup />
      </div>
    </div>
  );
};
export default Home;
