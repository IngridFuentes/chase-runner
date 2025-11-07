import React, { useState, useContext } from 'react';
import styles from '../styles/Banner.module.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import Logout from '../views/Logout';
import { UserContext } from '../context/UserContext';
import { useAuth0 } from "@auth0/auth0-react";

// const fallbackImage = '../image/avatar.jpeg';

const Banner = () => {

    const { user, isAuthenticated } = useAuth0();
    const [isPopupOpen, setPopupOpen] = useState(false);
    const { profilePic } = useContext(UserContext);

    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    return ( 
        <div className={styles.mainHeader}>
            <div className={styles.logoContainer}>
            <div className={styles.projectLogo}></div>
            <div className={styles.headerImage}></div>
            </div>
            <div className={styles.spacer}></div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" style={{borderStyle:'none', backgroundColor:'white', borderRadius:'0', width: 'auto'}}>
                <div>
                        <img 
                            className={styles.imageProfile} 
                            src={profilePic || user.picture} 
                            alt="Profile" 
                        />
                </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.dropdownMenu}>
                    <div>
                        <Link to="/profile" className={styles.profile}>My Profile</Link>
                    </div>
                    <div>
                        <Link to="/goals" className={styles.profile}> Goals </Link>
                    </div>
                    <div>
                        Settings
                    </div>
                    <div>
                        < Logout />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
export default Banner;