import styles from '../styles/Banner.module.css';
import Button from 'react-bootstrap/Button';
<<<<<<< HEAD
import Dropdown from 'react-bootstrap/Dropdown';
=======
>>>>>>> 4ed30e5721e21fa7f0ba6b89df04b0f07f401fe3

function Banner() {
    return ( 
        <div className={styles.mainHeader}>
            <div className={styles.projectLogo}></div>
            <div className={styles.headerText}>CHASE RUNNER</div>
            <div className={styles.spacer}></div>
<<<<<<< HEAD
            <Button variant="light">
                <a href="https://passage.id/">STATS</a>
            </Button>
            <Button variant="light">
                <a href="https://passage.id/">NEW RUN</a>
            </Button>
            <Button variant="light">
                <a href="https://passage.id/">GOALS</a>
            </Button>
            <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic" style={{borderStyle:'none'}}>
                <div className={styles.imageProfile}></div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item href="/logout">Logout</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
=======
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
>>>>>>> 4ed30e5721e21fa7f0ba6b89df04b0f07f401fe3
        </div>
    );
}
export default Banner;