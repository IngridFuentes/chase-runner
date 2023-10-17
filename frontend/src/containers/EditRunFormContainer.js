import React from 'react'
import { updateRun, deleteRun } from '../actions/fetchRuns.js'
import { setFormDataForEdit, resetNewJobAppForm } from '../actions/newJobApplicationForm.js'
import { connect } from 'react-redux'
import NewJobApplicationForm from '../components/NewJobApplicationForm.js';
import { NavLink } from 'react-router-dom'

class EditJobFormContainer extends React.Component {

    componentDidMount() {
        this.props.job && this.props.setFormDataForEdit(this.props.job)
    }

    componentDidUpdate(prevProps) {
        this.props.job && !prevProps.job && this.props.setFormDataForEdit(this.props.job)
    }

    componentWillUnmount() {
        this.props.resetNewJobAppForm()
    }

    handleSubmit = (newJobApplication, userId )=> {
        const { updateJobApp, job, history } = this.props
        updateJobApp({
            ...newJobApplication,
            jobId: job.id,
            userId
        }, history)
    }

    render() {

        const { history, deleteJobApp, job } = this.props
        const jobId = job ? job.id : null
        return (
            <div>
                <nav className="nav">
                    <NavLink to="/profile" className="link1"> My Applications </NavLink>
                </nav>
                
                <div className="margin-form"> 
                    <NewJobApplicationForm editMode handleSubmit={this.handleSubmit}/> 
                </div>
                <button onClick={() => deleteJobApp(jobId, history)}>Delete this application</button>
            </div>
        )  
           
    }
}

export default connect(null, { updateRun, setFormDataForEdit, resetNewJobAppForm, deleteRun }) (EditJobFormContainer);