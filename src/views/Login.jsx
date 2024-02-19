import styles from '../styles/Login.module.css';
import { Link } from "react-router-dom";

const Login = () => {

   return (
        <div>
           <img
            loading="lazy"
            src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/hasini-dibf1m/assets/1bew6og46zuv/chaserunner.jpg"
            className="aspect-[0.86] object-contain object-center w-full fill-[url(<path-to-image>),lightgray_0px_81.565px_/_100%_91.066%_no-repeat] overflow-hidden max-w-[782px]"
            style={{
                display: 'block',
                margin:'auto',
                width: '700px',
                height: '700px'
            }}
            alt=''/>          
           <button className={styles.buttonLogin}> 
                <Link to="/login" className={styles.link}> Log in </Link> 
            </button>

        </div>
     );
 }
 export default Login;

