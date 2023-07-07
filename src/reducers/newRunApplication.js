const initialState = {
    runDate: "",
    city: "",
    state: "",
    country: "",
    numberMarathon: "",
    notes: ""

}
const newRunApplication = (state = initialState, action) => {
    // console.log("in the reducer", action)
    switch (action.type) {
        case "UPDATE_NEW_RUN_APP_FORM":
            const returnVal = {
                ...state,
                [action.formData.name]: action.formData.value
            }
            return returnVal
        case "RESET_NEW_RUN_APP_FORM":
            return initialState
        case "SET_FORM_DATA_FOR_EDIT":
            return action.jobFormData
        default:
            return state;
    }
}
export default newRunApplication;