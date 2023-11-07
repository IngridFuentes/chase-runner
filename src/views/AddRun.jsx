import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
// import { SearchControl,  OpenStreetMapProvider } from 'leaflet-search';
import image from '../image/pin.png';
import 'leaflet/dist/leaflet.css';
import styles from '../styles/NewRun.module.css';

const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
const eventTypes = ['5K', '10K', 'Marathon', 'Fun Run', 'Road', 'Trail']

const stateCoordinates = { 
    AL: { latitude: 32.806671, longitude: -86.791130 },
    AK: { latitude: 61.370716, longitude: -152.404419 },
    NY: { latitude: 40.7128, longitude: -74.0060 }, // Coordinates for New York (NY)
    // { lat: 34.0522, lng: -118.2437 }, // Coordinates for Los Angeles (CA)
    // ... Add coordinates for other states
};


const AddRun = () => {
    const [stateLocation, setStateLocation] = useState('');
    const [marker, setMarker] = useState(null);


    const handleSelectChange = (e) => {
        e.preventDefault();
      const selectedState = e.target.value;
      setStateLocation(selectedState);
      console.log(stateCoordinates[selectedState])
      if (stateCoordinates[selectedState]) {
          setMarker({ ...stateCoordinates[selectedState], city: selectedState });
        }
    };
      
    const defaultIcon = L.icon({
      iconUrl: image, // Specify the path to your marker icon
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  console.log(marker, 'marker')
    return (
      <div className={styles.newrunSearch}>
        <form onSubmit={handleSelectChange}>
          <label>
            Select your State:
            <select value={stateLocation} onChange={handleSelectChange}>
              <option value="">Select your State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>
        </form>
  
  
        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {marker && (
            <Marker position={[marker.latitude, marker.longitude]} icon={defaultIcon}>
              <Popup>{marker.city}</Popup>
            </Marker>
          )}

        </MapContainer>
     
      </div>
      )
}

export default AddRun;