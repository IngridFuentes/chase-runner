import React, { useContext } from 'react';
import styles from '../styles/Banner.module.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";
import Logout from '../views/Logout';
import { UserContext } from '../context/UserContext.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=3f41b5&color=fff&size=128';

const Banner = ({
  cityName,
  setCityName,
  handleChange,
  handleCityKeyDown,
  inputRef,
  setFilteredData,
  setIsDropdownVisible,
  searchContainerRef
}) => {
  const { user } = useAuth0();
  const { profilePic } = useContext(UserContext);
  const displayPicture = profilePic || user?.picture || defaultAvatar;

  return (
    <div className={styles.mainHeader}>

      {/* Logo — kept exactly as before */}
      <div className={styles.logoContainer}>
        <div className={styles.projectLogo}></div>
        <span className={styles.brandName}>
          Chase <span className={styles.brandAccent}>Runner</span>
        </span>
      </div>

      {/* Search — replaces spacer */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchInput} ref={searchContainerRef}>
          <input
            ref={inputRef}
            type="text"
            className={styles.inputField}
            placeholder="Search by City"
            value={cityName}
            onChange={handleChange}
            onKeyDown={handleCityKeyDown}
          />
          <div className={styles.searchIconWrapper}>
            {cityName === "" ? (
              <SearchIcon style={{ fontSize: 18, color: '#888' }} />
            ) : (
              <CloseIcon
                style={{ fontSize: 18, color: '#888', cursor: 'pointer' }}
                onClick={() => {
                  setCityName("");
                  setFilteredData([]);
                  setIsDropdownVisible(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

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
          <div><Link to="/profile" className={styles.profile}>My Profile</Link></div>
          <div><Link to="/goals" className={styles.profile}>Goals</Link></div>
          <div>Settings</div>
          <div ><Logout /></div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Banner;