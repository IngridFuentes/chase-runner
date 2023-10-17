import React from 'react';
import { connect } from 'react-redux';
import Logout from './Logout.js';

const NavBar = ({ currentUserReducer }) => {
    return (
      <div className="NavBar">
         <h4 className="welcome"> 
         { currentUserReducer ? <strong> Welcome, {currentUserReducer.username} 
            <div className="button"> 
              <Logout/> 
            </div> 
          </strong> 
            : ""
          } 
          </h4>
    </div>
    )
}

const mapStateToProps = state => {
    return {
      currentUserReducer: state.currentUserReducer
    }
}

export default connect(mapStateToProps)(NavBar);