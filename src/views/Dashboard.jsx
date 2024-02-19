import React, { useState, useEffect } from 'react';
import {useCurrentUser} from '../hooks/useCurrentUser.js';
import {useAuthStatus} from '../hooks/useAuthStatus';
import styles from '../styles/Dashboard.module.css';
import Banner from '../components/Banner'
import Map from './Map';


const Dashboard = () => {
    const {isLoading, isAuthorized, username} = useAuthStatus();
    // const {isLoading, isAuthorized, username} = useCurrentUser();
    const [showAuthorizedBody, setShowAuthorizedBody] = useState(true);

    useEffect(() => {
        if(isAuthorized) {
            const timeoutId = setTimeout(() => {
                setShowAuthorizedBody(false);
            }, 3000);
            return () => clearTimeout(timeoutId);
        }
    },[isAuthorized]);

    if (isLoading) {
        return null;
    }
    const authorizedBody = 
    <>
        {/* Your username is: <b>{username}</b> */}
        Welcome back, runner!
    </>

    const unauthorizedBody = 
    <>
        You have not logged in and cannot view the dashboard.
        <br/><br/>
        <a href="/" className={styles.link}>Login to continue.</a>
    </>

    return (
        <div className={styles.dashboard}>
            <Banner />
            {/* <div className={styles.title}>{isAuthorized ? 'Welcome!' : 'Unauthorized'}</div> */}
            <div className={styles.message}>
                { isAuthorized ? (showAuthorizedBody && authorizedBody) : unauthorizedBody }
            </div>
            <Map />

        </div>
    );

}

export default Dashboard;

// import styles from "../styles/Dashboard.module.css";
// import React, { useState } from 'react';
// import { PassageAuthGuard } from "@passageidentity/passage-react";
// import { usePassageUserInfo } from "../hooks/";
// import LogoutButton from "../components/LogoutButton";
// import Map from './Map';

// const Dashboard = () => {
//   const { userInfo, loading } = usePassageUserInfo();

//   if (loading) {
//     return (
//       <div className={styles.dashboard}>
//         <div className={styles.title}>Loading</div>
//       </div>
//     );
//   }

//   return (
//    <PassageAuthGuard
//     // <div>
//        unAuthComp={
//         <div className={styles.dashboard}> 
//           <div className={styles.title}>you must be logged in</div> 
//           <div className={styles.message}> 
//             <a href="/">Login</a>
//           </div>
//         </div>
//         } 
//     >
//       <div className={styles.dashboard}>
//         <div className={styles.title}>Welcome</div>
//         <div className={styles.message}>
//           You successfully signed in with Passage. This is your homepage. <br />
//           <br />
//           Your username is: {userInfo?.email}
//         </div>
//         <LogoutButton />
//       </div>
//       {/* <Map /> */}
//     {/* </div> */}
//     </PassageAuthGuard>
//   );
// }

// export default Dashboard;