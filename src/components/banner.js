import styles from "../styles/Banner.module.css";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

function Banner() {
  return (
    <div className={styles.mainHeader}>
      <div className={styles.projectLogo}></div>
      <div className={styles.headerText}>CHASE RUNNER</div>
      <div className={styles.spacer}></div>
      <Button variant="light">
        <a href="https://passage.id/" style={{ textDecoration: "none" }}>
          STATS
        </a>
      </Button>
      <Button variant="light">
        <a href="https://passage.id/" style={{ textDecoration: "none" }}>
          NEW RUN
        </a>
      </Button>
      <Button variant="light">
        <a href="https://passage.id/" style={{ textDecoration: "none" }}>
          GOALS
        </a>
      </Button>
      <Dropdown>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          style={{ borderStyle: "none" }}
        >
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
