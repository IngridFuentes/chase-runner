import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import styles from "../styles/Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRunning,
  faMapMarkedAlt,
  faChartLine,
  faTrophy,
  faClock,
  faRoute,
  faHeart
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Track Your Run.
            <span className={styles.highlight}> Chase Your Goals.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Join thousands of runners tracking their progress, discovering new routes,
            and crushing personal records every day.
          </p>
          <div className={styles.buttonGroup}>
            <Login />
            <Signup />
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.floatingCard}>
            <FontAwesomeIcon icon={faRunning} className={styles.floatingIcon} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faRoute} />
          </div>
          <h3 className={styles.statNumber}>10K+</h3>
          <p className={styles.statLabel}>Routes Tracked</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faRunning} />
          </div>
          <h3 className={styles.statNumber}>50K+</h3>
          <p className={styles.statLabel}>Active Runners</p>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FontAwesomeIcon icon={faTrophy} />
          </div>
          <h3 className={styles.statNumber}>100K+</h3>
          <p className={styles.statLabel}>Goals Achieved</p>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything You Need to Run Better</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faMapMarkedAlt} />
            </div>
            <h3 className={styles.featureTitle}>Route Mapping</h3>
            <p className={styles.featureDescription}>
              Discover and save your favorite running routes with detailed maps and elevation data.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h3 className={styles.featureTitle}>Performance Analytics</h3>
            <p className={styles.featureDescription}>
              Track your pace, distance, and progress with comprehensive analytics and insights.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faClock} />
            </div>
            <h3 className={styles.featureTitle}>Personal Records</h3>
            <p className={styles.featureDescription}>
              Monitor your improvements and celebrate new personal bests across all distances.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <h3 className={styles.featureTitle}>Goal Setting</h3>
            <p className={styles.featureDescription}>
              Set ambitious goals and track your journey with personalized milestones.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <h3 className={styles.featureTitle}>Health Metrics</h3>
            <p className={styles.featureDescription}>
              Monitor heart rate, calories burned, and other vital health statistics.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FontAwesomeIcon icon={faRunning} />
            </div>
            <h3 className={styles.featureTitle}>Real-time Tracking</h3>
            <p className={styles.featureDescription}>
              Get live updates on your pace, distance, and time during every run.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Start Your Journey?</h2>
        <p className={styles.ctaSubtitle}>
          Join our community of passionate runners today
        </p>
        <div className={styles.buttonGroup}>
          <Login />
          <Signup />
        </div>
      </section>
    </div>
  );
};

export default Home;
