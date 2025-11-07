// import React from "react";
// import Login from "./Login";
// import Signup from "./Signup";
// import styles from "../styles/Home.module.css";

// const Home = () => {
//   return (
//     <div className={styles.container}>
//       <img
//         loading="lazy"
//         src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/hasini-dibf1m/assets/1bew6og46zuv/chaserunner.jpg"
//         className={styles.responsiveImg}
//         alt=""
//       />
//       <div className={styles.buttonGroup}>
//         <Login />
//         <Signup />
//       </div>
//     </div>
//   );
// };
// export default Home;

import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import styles from "../styles/Home.module.css";
import runner from "../image/runner.jpg"; // Make sure this import is there

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <h1 className={styles.appName}>
              <span className={styles.highlight}>CHASE RUNNER</span>
            </h1>
          </div>

          <div className={styles.mainSection}>
            <div className={styles.textContent}>
              <h2 className={styles.tagline}>
                Your Personal
                <span className={styles.highlight}> Running Companion</span>
              </h2>
              <p className={styles.description}>
                Map your runs across America. Track your progress. Crush your
                goals. With real-time analytics, personalized insights, and an
                AI running coach, Chase Runner turns every mile into a
                milestone.
              </p>

              {/* Buttons right under description */}
              <div className={styles.buttonGroup}>
                <Login />
                <Signup />
              </div>
            </div>

            <div className={styles.illustrationSection}>
              <div className={styles.shoeContainer}>
                <img
                  src={runner}
                  alt="Running shoe illustration for CR app"
                  className={styles.shoeImage}
                />

                {/* Motion lines */}
                <div className={styles.motionLines}>
                  <div className={styles.line}></div>
                  <div className={styles.line}></div>
                  <div className={styles.line}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
