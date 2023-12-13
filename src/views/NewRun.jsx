import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from '../styles/NewRun.module.css';
import SearchFilter from "./SearchFilter";
import { Link } from 'react-router-dom';


const NewRun = () => {
    const [race, setRace] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [searchText, setSearchText] = useState('');
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
// console.log(fetchEventData(), 'fetch')
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchEventData();
        setButtonClicked(true);
    };

    const handleSearchChange = (text) => {
        setSearchText(text);
        const filteredData = race.filter((event) => event.EventState.toLowerCase().includes(text.toLowerCase()))
        setRace(filteredData)
    };

    return (
        <div className={styles.newrunSearch}>
            <Link to="/dashboard"className={styles.link}>Go to dashboard</Link>
            { !buttonClicked && ( 
            <form onSubmit={handleSubmit}>
                <label>
                    <button type="submit">Show List of Runs</button>
                </label>
            </form>
            )}
            {buttonClicked && (
            <SearchFilter value={searchText} onChange={handleSearchChange}/>
            )}
            <Container>
                <div className={styles.results}>
                        {race.map((event, index) => (
                                // console.log(event.EventCity, "e")
                            <Row key={index}> 
                                        <Col md={2}>
                                            <div> City: </div>
                                            {event.EventCity}
                                        </Col>
                                        <Col md={2}>
                                            <div >State:</div>
                                            {event.EventState}
                                        <br/>
                                        </Col>
                                        <Col md={4}>
                                            Category:
                                            {event.Categories.map((e, i) => (
                                            <div key={i}>{e.CategoryName}</div>
                                            ))}
                                        <br/>
                                        </Col>
                                        <Col md={2}>
                                            <div className={styles.columnHeader}>Distance:</div>
                                            {event.Categories.map((e, i) => (
                                            <div key={i}>{e.Distance}</div>
                                            ))}
                                        <br/>
                                        </Col>
                                        <Col md={2}>
                                          <button> <a href={event.EventUrl} target="_blank" rel="noreferrer"> Sign up </a> </button>
                                        <br/>
                                        </Col>
                            </Row>
                        ))}
                </div>
            </Container>
        </div>
    )
};

export default NewRun;