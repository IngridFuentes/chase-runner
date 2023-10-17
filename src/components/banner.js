import styles from '../styles/Banner.module.css';

function Banner() {
    return ( 
        <div className={styles.mainHeader}>
            <div className={styles.projectLogo}></div>
            <div className={styles.headerText}>CHASE RUNNER</div>
            <div className={styles.spacer}></div>
            <a href="https://passage.id/" className={styles.link}>STATS</a>
        </div>
    );
}
export default Banner;