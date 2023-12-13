import React, { useState, useEffect } from 'react';
import StatsPopup from './StatsPopup';
import useMapData from '../hooks/useMapData';

const Stats = () => {
    const {
        savedPlaces: marathonStats,
        fetchSavedPlaces,
    } = useMapData();

    const [isPopupOpen, setPopupOpen] = useState(false);
    
    useEffect(() => {
        fetchSavedPlaces();
    }, [fetchSavedPlaces]);
    
    const handleOpenPopup = () => {
        setPopupOpen(true);
    };

    const handleClosePopup = () =>{
        setPopupOpen(false);
    };

    return (
        <div onClick={handleOpenPopup}>
            <StatsPopup marathonStats={marathonStats} onClose={handleClosePopup}/>
        </div>
    )
};

export default Stats;