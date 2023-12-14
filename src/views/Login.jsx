import chaserunnerimg from '../image/chaserunnerimg.jpg';
import styles from '../styles/Login.module.css';
import { Link } from "react-router-dom";

function Login() {
    return (
        <div>
            <img src={chaserunnerimg} alt="" className={styles.login}></img>
            <button className={styles.buttonLogin}> 
                <Link to="/login"> Log in </Link> 
            </button> 
        </div>
    );
}

export default Login;