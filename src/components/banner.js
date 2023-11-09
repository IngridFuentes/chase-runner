import styles from '../styles/Banner.module.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

function Banner() {
    return ( 
        <div className={styles.mainHeader}>
            <div className={styles.projectLogo}></div>
            <div className={styles.headerText}>CHASE RUNNER</div>
            <div className={styles.spacer}></div>
            <div className={styles.btns}>
                <Button variant="light">
                    <a href="/stats">STATS</a>
                </Button>
                <Button variant="light">
                    <a href="/newrun">NEW RUN</a>
                </Button>
                <Button variant="light">
                    <a href="/goals">GOALS</a>
                </Button>
            </div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{borderStyle:'none', backgroundColor:'white', borderRadius:'0'}}>
                <div className={styles.imageProfile}></div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
export default Banner;