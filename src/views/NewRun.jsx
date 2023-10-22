import { useState, useEffect } from "react";
import styles from '../styles/NewRun.module.css';

const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const eventTypes = ['5K', '10K', 'Marathon', 'Fun Run', 'Road', 'Trail']

export default function NewRun() {
    const [race, setRace] = useState([]);
    const [stateLocation, setStateLocation] = useState("");
    const [eventType, setEventType] = useState("");

    useEffect(() => {
        fetch('http://www.RunReg.com/api/search/', {
            }, {
                mode: "no-cors"
            })
        .then((data) => data.json())
        .then((res) => {
            // //testing json response data
        
            //fetch not fully working, having trouble updating the fetch request with the appropriate parameters

            // const dummyEvent = Object.keys(res.MatchingEvents[0]).map((key) => {
            //     return <p>{key}</p>
            // })
            // setRace(dummyEvent)
        })
        .catch((err) => console.log(err))
    }, [stateLocation, eventType])

    const selectState = (e) => {
        setStateLocation(e)
    }
    const selectEventType = (e) => {
        setEventType(e)
    }

    return (
        <div className={styles.newrunSearch}>
            <form>
                <label>
                    Search for Run
                    <div>
                        <input></input>
                    </div>
                    <div className="selectors">
                        <select 
                            value={stateLocation}
                            onChange={(e) => selectState(e.target.value)}
                        >
                            <option value="">Select your State</option>
                            {states.map((state) => {
                                return <option value={state}>{state}</option>
                            })}
                        </select>
                        <br></br>
                        <select
                            value={eventType}
                            onChange={(e) => selectEventType(e.target.value)}
                        >
                            <option value="">Select your Type of Event</option>
                            {eventTypes.map((type) => {
                                return <option value={type}>{type}</option>
                            })}
                        </select>
                    </div>
                    
                    <button>Submit</button>
                </label>
            </form>
            {/* For testing of results display after fetching from api */}
            {/* <p>{race}</p> */}
        </div>

    )
};