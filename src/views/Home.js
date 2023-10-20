// import "@passageidentity/passage-elements/passage-auth";
// import '@passageidentity/passage-auth'

// function Home() {
//     return (
//         <passage-auth app-id={process.env.REACT_APP_PASSAGE_APP_ID}></passage-auth>
//     );
// }

// export default Home;

import {
    PassageAuth,
    PassageUnAuthGuard,
  } from "@passageidentity/passage-react";
  import { Navigate } from "react-router-dom";
  
  function Home() {
    return (
      <PassageUnAuthGuard authComp={<Navigate to="/dashboard" />}>
        <PassageAuth />
      </PassageUnAuthGuard>
    );
  }
  
  export default Home;