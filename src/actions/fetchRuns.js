import { resetNewRunForm } from './newRun'

export const clearRuns = () => {
    return {
        type: "CLEAR_MY_RUN"
    }
}

export const addRun = run => {
    return {
        type: "ADD_RUN",
        run
    }
}

export const updateRunSuccess = run => {
    return {
        type: "UPDATE_RUN",
        run
    }
}

export const deleteRunSuccess = runId => {
    return {
        type: "DELETE_RUN",
        runId
    }
}


export const fetchRuns = () =>  {
    return (dispatch) => {
        // debugger
        // dispatch({type: 'LOADING_JOB_APPLICATIONS'});
        // console.log('inside fetch job applications')
        return fetch('http://localhost:3001/api/v1/runs', {
            credentials: "include",
            method: 'GET',
            headers: {
                "Content-Type": "run/json"
            },
        })
        .then(resp => {return resp.json()})
        // .then(data => console.log(data))
        .then(runs => { dispatch({ type: "ADD_RUNS", payload: runs})})
    };
}

export const createRun = (runData, history ) => {
    return dispatch => {
        const getBackRunData = {
            run: {
                run_date: runData.runDate,
                city: runData.city,
                state: runData.state,
                country: runData.country,
                number_marathon: runData.numberMarathon,
                notes: runData.notes,
                user_id: runData.userId
            }
        }

        return fetch('http://localhost:3001/api/v1/runs', {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "run/json"
            },
            body: JSON.stringify(getBackRunData)
        })
        .then(response => response.json())
        .then(response => {
            console.log('I am here on function createJobApplication')
            if (response.error) {
                alert(response.error)
            } else {
                dispatch(addRun(response))
                dispatch(resetNewRunForm())
                history.push(`/runs/${response.id}`)
            }
        })
    }
}

export const  updateRun = (runData, history ) => {

        return dispatch => {
    
            const getBackRunData = {
                run: {
                    run_date: runData.runDate,
                    city: runData.city,
                    state: runData.state,
                    country: runData.country,
                    number_marathon: runData.numberMarathon,
                    notes: runData.notes
                }
            }
    
            return fetch(`http://localhost:3001/api/v1/job_applications/${runData.runId}`, {
                credentials: "include",
                method: "PATCH",
                headers: {
                    "Content-Type": "run/json"
                },
                body: JSON.stringify(getBackRunData)
            })
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    alert(response.error)
                } else {
                    dispatch(updateRunSuccess(response))
                    history.push(`/runs/${response.id}`)
                }
            })
    
        }
}


export const deleteRun = (runId, history) => {

    return dispatch => {

        return fetch(`http://localhost:3001/api/v1/runs/${runId}`, {
            credentials: "include",
            method: "DELETE",
            headers: {
                "Content-Type": "run/json"
            },
        })
        .then(response => response.json())
        .then(response => {
            if (response.error) {
                alert(response.error)
            } else {
                dispatch(deleteRunSuccess(runId))
                history.push("/profile")
            }
        })
    }

}