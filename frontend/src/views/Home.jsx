import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <img
        loading="lazy"
        src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/hasini-dibf1m/assets/1bew6og46zuv/chaserunner.jpg"
        className={styles.responsiveImg}
        alt=""
      />
      <div className={styles.buttonGroup}>
        <Login />
        <Signup />
      </div>
    </div>
  );
};
export default Home;
