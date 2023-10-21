import { useState, useEffect } from "react";

export default function NewRun() {
    const [race, setRace] = useState("");

    // useEffect(() => {
    //     fetch('https://raceroster.com/api/v1/events/')
    //     .then((data) => data.json())
    //     .then((res) => {
    //         console.log(res);
    //         setRace(res.city)
    //     })
    //     .catch((err) => console.log(err))
    // })

    return (
        <div>
            <p>newrun Test</p>
        </div>

    )
};