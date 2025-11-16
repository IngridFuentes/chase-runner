import React, { useState, useContext } from 'react';
import styles from '../styles/Banner.module.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import Logout from '../views/Logout';
import { UserContext } from '../context/UserContext.jsx';
import { useAuth0 } from "@auth0/auth0-react";

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=3f41b5&color=fff&size=128';

const Banner = () => {
    const { user } = useAuth0();
    const { profilePic } = useContext(UserContext);
    const [isPopupOpen, setPopupOpen] = useState(false);


    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    // Determine which image to show: custom profile pic > Auth0 pic > default avatar
    const displayPicture = profilePic || user?.picture || defaultAvatar;


    return ( 
        <div className={styles.mainHeader}>
            <div className={styles.logoContainer}>
                <div className={styles.projectLogo}></div>
                <div className={styles.headerImage}></div>
            </div>
            <div className={styles.spacer}></div>
            <Dropdown>
                <Dropdown.Toggle 
                    variant="success" 
                    id="dropdown-basic" 
                    className={styles.dropdownToggle}
                >
                    <img 
                        src={displayPicture} 
                        alt="Profile" 
                        className={styles.profileImage}
                    />
                </Dropdown.Toggle>
                <Dropdown.Menu className={styles.dropdownMenu}>
                    <div>
                        <Link to="/profile" className={styles.profile}>My Profile</Link>
                    </div>
                    <div>
                        <Link to="/goals" className={styles.profile}>Goals</Link>
                    </div>
                    <div>
                        Settings
                    </div>
                    <div>
                        <Logout />
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default Banner;