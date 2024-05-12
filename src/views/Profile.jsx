// import '@passageidentity/passage-elements/passage-profile';

// const Profile = () => {
//   return (
//       <div>
//         <passage-profile app-id={process.env.REACT_APP_PASSAGE_APP_ID}></passage-profile>
//       </div>
//   );
// }
// export default Profile;

import React from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import styles from '../styles/Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <> 
      <div className={styles.backButton} onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
      </div>
      <div className={styles.profileContainer}>
          <img className={styles.profilePicture} src={user.picture} alt={user.name} />
          <div className={styles.profileDetails}> 
            <h2 className={styles.profileName}>{user.name}</h2>
            <p className={styles.profileEmail}>{user.email}</p>
            <ul className={styles.profileInfo}>
              {['nickname', 'name', 'email'].map((objKey, i) => 
                <li key={i}> 
                  {objKey}: {user[objKey]}
                </li>
              )}
            </ul>
          </div>
      </div>
    </>
    )
  );
};

export default Profile;