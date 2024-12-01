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
        // className="aspect-[0.86] object-contain object-center w-full fill-[url(<path-to-image>),lightgray_0px_81.565px_/_100%_91.066%_no-repeat] overflow-hidden max-w-[782px]"
        className={styles.responsiveImg}
        // style={{
        //   display: "block",
        //   margin: "auto",
        //   width: "700px",
        //   height: "700px",
        // }}
        alt=""
      />
      <Login />
      <Signup />
    </div>
  );
};
export default Home;
