import { useState, useEffect } from "react";
import styles from '../styles/NewRun.module.css';

const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const eventTypes = ['5K', '10K', 'Marathon', 'Fun Run', 'Road', 'Trail']

export default function NewRun() {
    const [race, setRace] = useState([]);

    useEffect(() => {
        fetch('http://www.RunReg.com/api/search')
        .then((data) => data.json())
        .then((res) => {
            console.log(res)
            //testing json response data
            console.log(res.MatchingEvents[0].Region);
            setRace(res.MatchingEvents[0].EventName)
        })
        .catch((err) => console.log(err))
    })

    return (
        <div className={styles.newrunSearch}>
            <form>
                <label>
                    Search for Run
                    <div>
                        <input></input>
                    </div>
                    <div>
                        <select name="states">
                            <option value="">Select your State</option>
                            {states.map((state) => {
                                return <option value={state}>{state}</option>
                            })}
                        </select>
                    </div>
                    <div>
                        <select name="Event Types">
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
            <p>{race}</p>
        </div>

    )
};