import React, { useState, useEffect } from 'react';

const StatsPopup = ({onClose, marathonStats}) => {
    const[count, setCount] = useState({});

    useEffect(() => {
        const counts = marathonStats.reduce((acc, entry) => {
            const country = entry.country;
            if(country) {
                acc[country] = (acc[country] || 0) + 1;
            }

            return acc;
        }, {})
        setCount(count);
    }, [marathonStats]);

    const country = marathonStats.map((e,index) =>(
        e.country !== null && (
            <li key={index}>
            {e.country}
            </li>
        )
    ));

    return(
        <div>
            <div>
                <button onClick={onClose}>X</button>
                <h2>Your Stats</h2>
                        {country}
            </div>
        </div>
    )
};

export default StatsPopup;