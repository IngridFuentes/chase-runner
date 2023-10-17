import React from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../actions/currentUser.js'
import { useNavigate } from 'react-router-dom';

const Logout = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = (event) => {
        event.preventDefault();
        dispatch(logout());
        navigate('/');
      };
    

    return (
        <form onSubmit={handleLogout}>
            <input type="submit" value="Log Out" />
        </form>
    )
}

export default Logout;