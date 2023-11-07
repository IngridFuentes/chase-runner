import { useState, useEffect } from "react";
import styles from '../styles/NewRun.module.css';
import AddRun from "./AddRun";

// const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
// const eventTypes = ['5K', '10K', 'Marathon', 'Fun Run', 'Road', 'Trail']

export default function NewRun() {
    const [race, setRace] = useState([]);
    // const [stateLocation, setStateLocation] = useState("");
    // const [eventType, setEventType] = useState("");

    const fetchEventData = async () => {
        try {
            const response = await fetch('http://www.RunReg.com/api/search/', {
            }, {
                mode: "no-cors"
            })
            const data = await response.json();
            setRace(data.MatchingEvents || []);
            console.log(data.MatchingEvents, 'data')
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchEventData();
    };

    return (
        <div className={styles.newrunSearch}>
            <form onSubmit={handleSubmit}>
                <label>
                    <button type="submit">Show List of Runs</button>
                </label>
            </form>
            <div className={styles.results}>
                <ul>
                    {race.map((event, index) => (
                        // console.log(event.EventCity, "e")
                        <li key={index}> 
                            {event.EventCity}
                        {event.Categories.map((e, i) => (
                            <li key={i}>
                                {e.CategoryName}
                                {e.Distance}
                            </li>
                            // console.log(e, "eeeeeeeeee")
                        ))}
                     </li>
                    ))}
                </ul>
            </div>
            {/* <form onSubmit={handleSubmit}>
                <label>
                    Search for Run
                    <div>
                        <input></input>
                    </div>
                    <div className="selectors">
                        <select 
                            value={stateLocation}
                            onChange={(e) => setStateLocation(e.target.value)}
                        >
                            <option value="">Select your State</option>
                            {states.map((state) => {
                                return <option key={state} value={state}>{state}</option>
                            })}
                        </select>
                        <br></br>
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                        >
                            <option value="">Select your Type of Event</option>
                            {eventTypes.map((type) => {
                                return <option key={type} value={type}>{type}</option>
                            })}
                        </select>
                    </div>
                    
                    <button type="submit">Submit</button>
                </label>
            </form> */}
            {/* For testing of results display after fetching from api */}
            {/* <p>{race}</p> */}
            {/* {data.map((event) => (
                <div key={event.id}>
                    <p>{event.name}</p>
                    {/* Render other event details */}
                {/* </div> */}
            {/* ))} */}
            {/* <AddRun /> */}
        </div>

    )
};