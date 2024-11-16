import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "../styles/Profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../context/UserContext";
import RunningShoesSpinner from "./RunningShoesSpinner";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { profilePic, setProfilePic } = useContext(UserContext);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <RunningShoesSpinner />;
  }

  return (
    isAuthenticated && (
      <>
        <div className={styles.backButton} onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <div className={styles.profileContainer}>
          <img
            className={styles.profilePicture}
            src={profilePic || user.picture}
            alt={user.name}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "1rem" }}
          />
          <div className={styles.profileDetails}>
            <p className={styles.profileEmail}>{user.email}</p>
            <ul className={styles.profileInfo}>
              {["nickname", "name", "email"].map((objKey, i) => (
                <li key={i}>
                  {objKey}: {user[objKey]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  );
};

export default Profile;
