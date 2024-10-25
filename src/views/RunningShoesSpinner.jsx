import React from "react";
import styles from "../styles/RunningShoesSpinner.module.css";
import runnerLogo from "../image/runnerLogo.jpg";

const RunningShoesSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img
        src={runnerLogo}
        alt="Sneaker Spinner"
        className={styles.runningShoeSpinner}
        width={100}
        height={100}
      />
    </div>
  );
};

export default RunningShoesSpinner;
