import React from 'react'
import { createRun } from '../actions/fetchRuns.js'
import { connect } from 'react-redux'
import NewRunForm from '../components/NewRunForm.js';
import { NavLink } from 'react-router-dom'

const NewRunFormContainer = ({ history, createRun}) => {

    const handleSubmit = (newRun, userId )=> {
        
        createRun({
            ...newRun,
            userId
        }, history)
    }

    return (
        <div>
            <nav className="nav">
                <NavLink to="/profile" className="link1"> My Runs </NavLink>
            </nav>
            <div className="margin-form">
                <NewRunForm history={history} handleSubmit={handleSubmit}/> 
            </div>
        </div>
    )
}

export default connect(null, { createRun }) (NewRunFormContainer);