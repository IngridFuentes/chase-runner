import React from 'react';
import { updateNewRunForm } from '../actions/newRun.js'
import { connect } from 'react-redux'


const NewRunForm = ({ newRunApplication, updateNewRunForm, userId, handleSubmit, editMode }) => {
console.log(editMode, 'edit')
console.log(updateNewRunForm, 'update')


    const handleChange = event => {
        const { value, name } = event.target
        updateNewRunForm(name, value)
    }

    return(

        <form onSubmit={ event => { 
            event.preventDefault()
            handleSubmit(newRunApplication, userId)}
        }>
            <input
            placeholder="Date"
            name="applicationDate"
            onChange={handleChange}
            value={newRunApplication.runDate}
            /><br/>
            <input
            placeholder="City"
            name="city"
            onChange={handleChange}
            value={newRunApplication.city}
            /><br/>
            <input
            placeholder="State"
            name="state"
            onChange={handleChange}
            value={newRunApplication.state}
            /><br/>
            <input
            placeholder="Country"
            name="country"
            onChange={handleChange}
            value={newRunApplication.country}
            /><br/>
            <input
            placeholder="Marathon"
            name="marathonNumber"
            onChange={handleChange}
            value={newRunApplication.numberMarathon}
            /><br/>
            <input
            placeholder="Notes"
            name="notes"
            onChange={handleChange}
            value={newRunApplication.notes}
            />
            <br/>
            <br/>
            <input type="submit" 
            value= {editMode ? "Update it" : "Add your marathon"} />

        </form>
)};

const mapStateToProps = state => {
    
    const userId = state.currentUserReducer ? state.currentUserReducer.id : "" 
    return{
        newRunApplication: state.newRunApplication,
        userId
    }
}

export default connect (mapStateToProps, { updateNewRunForm }) (NewRunForm);