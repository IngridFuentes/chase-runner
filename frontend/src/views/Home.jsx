import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import styles from "../styles/Home.module.css";
import runner from "../image/runner.jpg";
import PublicAIChat from "./PublicAIChat";

const Home = () => {
  const [showAIChat, setShowAIChat] = useState(false);

  const Cards = () => (
    <div className={styles.cardGrid}>
      <div className={styles.statCard}>
        <span className={styles.statCardValue}>12</span>
        <span className={styles.statCardLabel}>States done</span>
      </div>
      <div className={styles.statCard}>
        <span className={styles.statCardValue}>38</span>
        <span className={styles.statCardLabel}>To go</span>
      </div>
      <div className={`${styles.statCard} ${styles.statCardWide}`}>
        <span className={styles.statCardSmallLabel}>Next race suggestion</span>
        <span className={styles.statCardRace}>Boston Marathon, MA</span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <img src={runner} alt="Chase Runner logo" className={styles.navLogoImg} />
          {/* <span className={styles.navLogoText}>Chase Runner</span> */}
                  <span className={styles.brandName}>
                    Chase <span className={styles.brandAccent}>Runner</span>
                  </span>
        </div>
        <div className={styles.navButtons}>
          <Login />
          <Signup />
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.textCol}>
          <span className={styles.tag}>Running tracker</span>
          <h1 className={styles.headline}>
            Run all 50 states.<br />Start anywhere.
          </h1>
          <p className={styles.description}>
            Log your races, track which states you've visited, and let AI help
            you plan the rest of the journey.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>50</span>
              <span className={styles.statLabel}>States to conquer</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>AI</span>
              <span className={styles.statLabel}>Powered coaching</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>Free</span>
              <span className={styles.statLabel}>Forever plan</span>
            </div>
          </div>
           <button
            className={styles.publicAIBtn}
            onClick={() => setShowAIChat(true)}
          >
            <i className="ti ti-robot" aria-hidden="true" />
            🤖 Ask Coach Chase — no account needed
          </button>
          {/* Cards visible only on mobile */}
          <div className={styles.mobileCards}>
            <Cards />
          </div>
        </div>

        {/* Cards visible only on desktop */}
        <div className={styles.imageCol}>
          <Cards />
        </div>
      </main>
      {showAIChat && <PublicAIChat onClose={() => setShowAIChat(false)} />}
    </div>
  );
};

export default Home;