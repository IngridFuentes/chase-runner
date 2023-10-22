// import {useCurrentUser} from '../hooks/useCurrentUser.js';
// import {useAuthStatus} from '../hooks/useAuthStatus';
import styles from '../styles/Dashboard.module.css';
import { PassageAuthGuard } from "@passageidentity/passage-react";
import { usePassageUserInfo } from "../hooks/";
import LogoutButton from "../components/LogoutButton";
import SimpleMap from '../components/SimpleMap';


function Dashboard() {
    // const {isLoading, isAuthorized, username} = useAuthStatus();
    // const {isLoading, isAuthorized, username} = useCurrentUser();
    const { userInfo, loading } = usePassageUserInfo();

    if (loading) {
        return (
          <div className={styles.dashboard}>
            <div className={styles.title}>Loading</div>
          </div>
        );
      }

      return (
        <PassageAuthGuard
          unAuthComp={
            <div className={styles.dashboard}>
              <div className={styles.title}>you must be logged in</div>
              <div className={styles.message}>
                <a href="/">Login</a>
              </div>
            </div>
          }
        >
          <div className={styles.dashboard}>
            <div className={styles.title}>Welcome</div>
            <div className={styles.message}>
              You successfully signed in with Passage. This is your homepage. <br />
              <br />
              Your username is: {userInfo?.email}
            </div>
            <LogoutButton />
          </div>
            <SimpleMap />
        </PassageAuthGuard>
      );
    }
  
  export default Dashboard;

//     if (isLoading) {
//         return null;
//     }
//     const authorizedBody = 
//     <>
//         Your username is: <b>{username}</b>
//     </>

//     const unauthorizedBody = 
//     <>
//         You have not logged in and cannot view the dashboard.
//         <br/><br/>
//         <a href="/" className={styles.link}>Login to continue.</a>
//     </>

//     return (
//         <div className={styles.dashboard}>
//             <div className={styles.title}>{isAuthorized ? 'Welcome!' : 'Unauthorized'}</div>
//             <div className={styles.message}>
//                 { isAuthorized ? authorizedBody : unauthorizedBody }
//             </div>
//             <SimpleMap />
//         </div>
//     );

// }

