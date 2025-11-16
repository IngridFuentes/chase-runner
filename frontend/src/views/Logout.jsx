import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/Logout.module.css";

const Logout = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      className={styles.logoutButton}
    >
      Log Out
    </button>
  );
};

export default Logout;
