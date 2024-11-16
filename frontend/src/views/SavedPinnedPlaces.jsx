import React, { useEffect } from 'react';
import L from 'leaflet';

const MapComponent = () => {
  useEffect(() => {
    const map = L.map('mapcanvas').setView([51.505, -0.09], 13);

    map.on('click', (e) => {
      const { lat, lon } = e.latlng;

      // Save marker position to the server
      fetch('/api/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lon }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Marker saved:', data);
        })
        .catch((error) => {
          console.error('Error saving marker:', error);
        });

      // Place marker on the map
      const marker = new L.marker(e.latlng).addTo(map);
    });
  }, []); // Empty dependency array ensures this effect runs once after the initial render

  return <div id="mapcanvas" style={{ height: '400px' }}></div>;
};

export default MapComponent;

  