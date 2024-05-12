import React, { useState } from 'react';
import styles from '../styles/Banner.module.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import Logout from '../views/Logout';
import Profile from '../views/Profile';


const Banner = () => {

    const [isPopupOpen, setPopupOpen] = useState(false);
    
    const handleOpenPopup = () => {
        setPopupOpen(true);
    };
    return ( 
        <div className={styles.mainHeader}>
            <div className={styles.projectLogo}></div>
            <div className={styles.headerImage}></div>
            <div className={styles.spacer}></div>
            {/* <div className={styles.btns}> */}
                {/* <Button variant="light" onClick={handleOpenPopup}>
                    <a href="/stats">STATS</a>
                </Button>
                <Button variant="light">
                    <a href="/newrun">NEW RUN</a>
                </Button>
                <Button variant="light">
                    <a href="/goals">GOALS</a>
                </Button> */}
            {/* </div> */}
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{borderStyle:'none', backgroundColor:'white', borderRadius:'0', width: 'auto'}}>
                <div className={styles.imageProfile}></div>
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.dropdownMenu}>
                {/* <Dropdown.Item> */}
                    <div>
                        <Link to="/profile" className={styles.profile}>My Profile</Link>
                    </div>
                {/* </Dropdown.Item> */}
                {/* <Dropdown.Item>
                    {/* <Link to="/" className={styles.profile}> */}
                      {/* <div> */}
                      <div>
                        Settings
                      </div>
                      
                      <div>
                        < Logout />
                      </div>
                        {/* </div>  */}
                    {/* </Link> */}
                {/* </Dropdown.Item> */}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
export default Banner;