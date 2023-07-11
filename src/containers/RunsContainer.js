import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { fetchRuns } from '../actions/fetchRuns'
import RunsList from '../components/RunsList'
import { NavLink } from 'react-router-dom'


const RunsContainer = (props) => {  

    // const [ query, setQuery ] = useState('');


    // const handleSubmit = (event) => {
    //     event.preventDefault()
    // }

    // const handleOnChange = (event) => {
    //     setQuery(event.target.value)
    // }

    // useEffect(() => {
    //     props.fetchRuns()
    // }, [props])

    // const filteredRuns = useMemo(() => {
    //     return props.runsReducer.filter(run =>
    //          query ? run.city.toLowerCase().includes(query.toLowerCase()) : true 
    // );
    // },[props.runsReducer, query]);

        return(
            <div>
                {/* <nav className="nav"> 
                    <NavLink to="/applications/new" className="link2"> Create Application </NavLink > 
                </nav>
                <h4 className="job"> MY MARATHONS </h4>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Search by City" 
                        value={query} 
                        onChange={handleOnChange} 
                    />
                    <button type="submit">Submit</button>
                </form>
                <RunsList jobs={filteredRuns}/> */}
               "hey"
            </div>
        )
    }

// const mapStateToProps = (state) => {
//     return{
//         runsReducer: state.runsReducer,

//     }
// }


// export default connect(mapStateToProps,{ fetchRuns }) (RunsContainer);

export default RunsContainer;
