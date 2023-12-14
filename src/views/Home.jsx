import "@passageidentity/passage-elements/passage-auth";
import styles from '../styles/Login.module.css';
// import '@passageidentity/passage-auth'

function Home() {
    return (
        <div className={styles.loginPage }>
            <passage-auth app-id={process.env.REACT_APP_PASSAGE_APP_ID}></passage-auth>
        </div>
    );
}

export default Home;