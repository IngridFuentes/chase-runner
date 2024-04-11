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
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <ul>
          {Object.keys(user).map((objKey, i) => <li key={i}> {objKey}: {user[objKey]} </li>)}
        </ul>
      </div>
    )
  );
};

export default Profile;