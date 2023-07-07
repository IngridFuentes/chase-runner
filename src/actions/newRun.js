export const updateNewRunForm = (name, value) => {
    const formData = { name, value }
    console.log("formData in the action creator", formData)
    return {
        type: "UPDATE_NEW_RUN_FORM",
        formData
    }
}

export const resetNewRunForm = () => {
    return {
        type: "RESET_NEW_RUN_FORM",
    }
}

export const setFormDataForEdit = run => {
    
    const runFormData = {
        runDate: run.run_date,
        city: run.city,
        state: run.state,
        country: run.country,
        numberMarathon: run.number_marathon,
        notes: run.notes
    }
    return{
        type: "SET_FORM_DATA_FOR_EDIT",
        runFormData
    }
}