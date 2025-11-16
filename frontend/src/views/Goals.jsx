import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Goals.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendar,
  faMapMarkerAlt,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";

const Goals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([
    {
      id: 1,
      race: "Chicago Marathon",
      date: "2025-10-12",
      type: "Full",
      location: "Chicago, IL",
    },
    {
      id: 2,
      race: "Bay to Breakers",
      date: "2025-05-18",
      type: "12K",
      location: "San Francisco, CA",
    },
  ]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.goalsContainer}>
      <div className={styles.backButton} onClick={goBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </div>

      <div className={styles.goalsContent}>
        <h2 className={styles.goalsSentence}>Your Race Goals</h2>
        <p className={styles.registerSentence}>
          Plan your upcoming races and track your progress!{" "}
          <Link
            to="https://runningintheusa.com/classic/weeks/marathon/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.externalLink}
          >
            Find races here
          </Link>
        </p>

        <div className={styles.goalsGrid}>
          {goals.map((goal) => (
            <div key={goal.id} className={styles.goalCard}>
              <div className={styles.goalHeader}>
                <FontAwesomeIcon icon={faTrophy} className={styles.icon} />
                <span className={styles.raceType}>{goal.type}</span>
              </div>
              <h3 className={styles.raceName}>{goal.race}</h3>
              <div className={styles.goalDetails}>
                <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>
                    {new Date(goal.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{goal.location}</span>
                </div>
              </div>
            </div>
          ))}

          <div className={styles.addGoalCard}>
            <div className={styles.addGoalContent}>
              <div className={styles.plusIcon}>+</div>
              <p>Add New Goal</p>
              <span className={styles.comingSoon}>Coming Soon!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
