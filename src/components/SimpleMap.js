import React, { useRef } from "react";
import styles from '../styles/SimpleMap.module.css';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const SimpleMap = () => {
    const mapRef = useRef(null);
    const latitude = 51.505;
    const longitude = -0.09;
    const position = [51.505, -0.09];
  
    return ( 
      // Make sure you set the height and width of the map container otherwise the map won't show
        <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "50vh", width: "50vw"}}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <div className={styles.marker}> 
            <span><b></b></span>
            </div>
            </Marker>
        </MapContainer>
    );
  };
  
  export default SimpleMap;