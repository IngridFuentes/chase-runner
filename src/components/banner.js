import styles from '../styles/Banner.module.css';
import Button from 'react-bootstrap/Button';

function Banner() {
    return ( 
        <div className={styles.mainHeader}>
            <div className={styles.projectLogo}></div>
            <div className={styles.headerText}>CHASE RUNNER</div>
            <div className={styles.spacer}></div>
            <Button variant="dark">
                <a href="https://passage.id/">STATS</a>
            </Button>
            <Button variant="dark">
                <a href="https://passage.id/">NEW RUN</a>
            </Button>
            <Button variant="dark">
                <a href="https://passage.id/">GOALS</a>
            </Button>
            <div className={styles.imageProfile}></div>
        </div>
    );
}
export default Banner;