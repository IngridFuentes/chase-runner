import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet library
import image from '../image/pin.png';
import ConfettiExplosion from 'react-confetti-explosion';
import styles from '../styles/CityMap.module.css';

const CityMap = () => {
  const [cityName, setCityName] = useState('');
  const [cityCoordinates, setCityCoordinates] = useState(null);
  const [mapCenter, setMapCenter] = useState([39.106667, -94.676392]); // Default map center
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCitySearch = async () => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${cityName}&lang=en&limit=10&type=city&apiKey=63f9e025a41e4c2eb7b9fea7f557a9b5`
      );
      const data = await response.json();
        console.log(data.features[0].properties, 'data')
        const { lat, lon } = data.features[0].properties;
        setCityCoordinates({ lat, lon });

    const res = await fetch('http://localhost:3000/api/places', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lon, name: cityName  }),
    });
    if(!res.ok){
        throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
    }
    setCityName('');
    setShowConfetti(true);
    setTimeout(() => {
        setShowConfetti(false);
      }, 2000);

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    //Fetch saved places from the backend
    const fetchSavedPlaces = async () => {
      try {
          const response = await fetch('http://localhost:3000/api/places');
          if(response.ok) {
            const data = await response.json();
            setSavedPlaces(data);
            console.log(data, 'hi');
          } else{
            throw new Error('Network response was not ok.');
          }
        // const data = await response.json();
        // console.log(data, 'backend data')
        // setSavedPlaces(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSavedPlaces();
  }, []);

  const customIcon = new L.Icon({
    iconUrl: image,
    iconSize: [25, 25], 
  });

  return (
    <div>
          <div className={styles.input}>
              <input
                type="text"
                placeholder="Enter city name"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />
              <button onClick={handleCitySearch} className={styles.btn}>Add your run</button>
          </div>
          {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={2000}
                angle={120} 
                gravity={0.5}
            />}
      <MapContainer center={mapCenter} zoom={3} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cityCoordinates && (
          <Marker position={[cityCoordinates.lat, cityCoordinates.lon]} icon={customIcon}>
            <Popup>{`Coordinates: ${cityCoordinates.lat}, ${cityCoordinates.lon}`}</Popup>
          </Marker>
        )}
        {savedPlaces.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon, place.name]} icon={customIcon}>
            <Popup>{`Saved Place ${index + 1}: Coordinates - ${place.lat}, ${place.lon}, ${place.name}`}</Popup>
          </Marker>
        ))}
         
      </MapContainer>
    </div>
  );
};

export default CityMap;

