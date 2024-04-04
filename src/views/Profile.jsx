// import '@passageidentity/passage-elements/passage-profile';

// const Profile = () => {
//   return (
//       <div>
//         <passage-profile app-id={process.env.REACT_APP_PASSAGE_APP_ID}></passage-profile>
//       </div>
//   );
// }
// export default Profile;

import { PassageProfile } from "@passageidentity/passage-react";

function Profile() {
  return (
    <div>
      <PassageProfile />
    </div>
  );
}

export default Profile;