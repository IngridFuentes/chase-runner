import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Goals.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Goals = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className={styles.backButton} onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <h2 className={styles.goalsSentence}>Plan Your Future Events</h2>
      <p className={styles.registerSentence}>
        Register{" "}
        <Link
          to="https://runningintheusa.com/classic/weeks/marathon/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {" "}
          here{" "}
        </Link>{" "}
        for your next Marathon, Half, 10K, 5K and more!
      </p>
      {/* <button>Add Event</button> */}
    </div>
  );
};
export default Goals;
