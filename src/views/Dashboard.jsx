// import {useCurrentUser} from '../hooks/useCurrentUser.js';
import {useAuthStatus} from '../hooks/useAuthStatus';
import styles from '../styles/Dashboard.module.css';
import Banner from '../components/Banner'
import Map from './Map';


const Dashboard = () => {
    const {isLoading, isAuthorized, username} = useAuthStatus();
    // const {isLoading, isAuthorized, username} = useCurrentUser();


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
                { isAuthorized ? authorizedBody : unauthorizedBody }
            </div>
            <Map />

        </div>
    );

}

export default Dashboard;