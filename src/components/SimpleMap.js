import React, { useRef, useState } from "react";
// import styles from '../styles/SimpleMap.module.css';
import image from '../image/pin.png';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from 'leaflet';
import MarkerClusterGroup from "react-leaflet-cluster";
// import { useGeolocated } from "react-geolocated";
import nextId from 'react-id-generator';

const SimpleMap = () => {
    // const mapRef = useRef();    
    // const [state, setState] = useState({
    //   lat: 40.72683,
    //   lng:  -73.943512,
    //   locations: [{ lat: 40, lng: -73, id: 'hi' }],
    // });

    // const markers= [
    //   {
    //     geocode: [48.86, 2.3522]
    //   },
    //   {
    //     geocode: [48.85, 2.3522]
    //   },
    //   {
    //     geocode: [48.855, 2.34]
    //   }
    // ];


    // const { coords} =
    // useGeolocated({
    //     positionOptions: {
    //         enableHighAccuracy: false,
    //     },
    //     userDecisionTimeout: 5000,
    // });
    // console.log(coords, "coords")

  //   const handleClick = (event) => {
	// 	console.log('clicked');
	// 	console.log(event);
	// 	const coords = event.latlng;
	// 	console.log(coords);
	// 	const obj = {
	// 		lat: coords.lat,
	// 		lng: coords.lng,
	// 		id: nextId(),
	// 	};
	// 	const locations = [...state.locations, obj];
	// 	setState({ ...state, locations, lat: coords.lat, lng: coords.lng });
	// 	console.log(state);
	// };

  // const findMe = () => {
	// 	navigator.geolocation.getCurrentPosition((position) => {
	// 		console.log(position, 'pos');
	// 		setState({
	// 			...state,
	// 			lat: position.coords.latitude,
	// 			lng: position.coords.longitude,
	// 		});
	// 	});
	// };

	// console.log(state);

  const customIcon = new Icon({
    iconUrl: image,
    iconSize: [38, 38]
  });

    return ( 
      <div> 
      {/* // Make sure you set the height and width of the map container otherwise the map won't show */}
        <MapContainer center={[48.8566, 2.356 ]} zoom={13} 
         style={{height: "50vh", width: "50vw"}} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /> 
          {/* {state.locations.length > 0 &&
					state.locations.map((location) => ( */}
          {/* {markers.map((marker) => (  */}
        <MarkerClusterGroup> 
        
						<Marker
							position={[48.86, 2.3522]}
              icon={customIcon}
						>
							<Popup>
								You are here!
							</Popup>
						</Marker>
        
          </MarkerClusterGroup>
          {/* ))} */}
					{/* ))} */}
        </MapContainer>
        </div>
    );
  };
  
  export default SimpleMap;