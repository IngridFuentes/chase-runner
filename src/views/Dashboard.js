<<<<<<< HEAD
import {useCurrentUser} from '../hooks/useCurrentUser.js';
// import {useAuthStatus} from '../hooks/useAuthStatus';
import styles from '../styles/Dashboard.module.css';
import SimpleMap from '../components/SimpleMap';


function Dashboard() {
    // const {isLoading, isAuthorized, username} = useAuthStatus();
    const {isLoading, isAuthorized, username} = useCurrentUser();

=======
import {useAuthStatus} from '../hooks/useAuthStatus';
import styles from '../styles/Dashboard.module.css';

function Dashboard() {
    const {isLoading, isAuthorized, username} = useAuthStatus();
>>>>>>> 4ed30e5721e21fa7f0ba6b89df04b0f07f401fe3

    if (isLoading) {
        return null;
    }
    const authorizedBody = 
    <>
<<<<<<< HEAD
=======
        You successfully signed in with Passage.
        <br/><br/>
>>>>>>> 4ed30e5721e21fa7f0ba6b89df04b0f07f401fe3
        Your username is: <b>{username}</b>
    </>

    const unauthorizedBody = 
    <>
        You have not logged in and cannot view the dashboard.
        <br/><br/>
        <a href="/" className={styles.link}>Login to continue.</a>
    </>

    return (
        <div className={styles.dashboard}>
            <div className={styles.title}>{isAuthorized ? 'Welcome!' : 'Unauthorized'}</div>
            <div className={styles.message}>
                { isAuthorized ? authorizedBody : unauthorizedBody }
            </div>
<<<<<<< HEAD
            <SimpleMap />
=======
>>>>>>> 4ed30e5721e21fa7f0ba6b89df04b0f07f401fe3
        </div>
    );

}

export default Dashboard;