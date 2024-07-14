// import { useState, useRef, useEffect } from "react";
// import L from "leaflet";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
// // import { SearchControl,  OpenStreetMapProvider } from 'leaflet-search';
// import image from '../image/pin.png';
// import 'leaflet/dist/leaflet.css';
// import styles from '../styles/NewRun.module.css';

// const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
// const eventTypes = ['5K', '10K', 'Marathon', 'Fun Run', 'Road', 'Trail']

// const stateCoordinates = { 
//     AL: { latitude: 32.806671, longitude: -86.791130 },
//     AK: { latitude: 61.370716, longitude: -152.404419 },
//     NY: { latitude: 40.7128, longitude: -74.0060 }, // Coordinates for New York (NY)
//     // { lat: 34.0522, lng: -118.2437 }, // Coordinates for Los Angeles (CA)
//     // ... Add coordinates for other states
// };


// const AddRun = () => {
//     const [stateLocation, setStateLocation] = useState('');
//     const [marker, setMarker] = useState(null);


//     const handleSelectChange = (e) => {
//         e.preventDefault();
//       const selectedState = e.target.value;
//       setStateLocation(selectedState);
//       console.log(stateCoordinates[selectedState])
//       if (stateCoordinates[selectedState]) {
//           setMarker({ ...stateCoordinates[selectedState], city: selectedState });
//         }
//     };
      
//     const defaultIcon = L.icon({
//       iconUrl: image, // Specify the path to your marker icon
//       iconSize: [25, 41],
//       iconAnchor: [12, 41],
//       popupAnchor: [1, -34],
//     });
//   console.log(marker, 'marker')
//     return (
//       <div className={styles.newrunSearch}>
//         <form onSubmit={handleSelectChange}>
//           <label>
//             Select your State:
//             <select value={stateLocation} onChange={handleSelectChange}>
//               <option value="">Select your State</option>
//               {states.map((state) => (
//                 <option key={state} value={state}>
//                   {state}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </form>
  
  
//         <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{ height: '400px', width: '100%' }}
//         >
//           <TileLayer
//             attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {marker && (
//             <Marker position={[marker.latitude, marker.longitude]} icon={defaultIcon}>
//               <Popup>{marker.city}</Popup>
//             </Marker>
//           )}

//         </MapContainer>
     
//       </div>
//       )
// }

// export default AddRun;

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Select from 'react-select';
import useMapData from '../hooks/useMapData';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/Map.module.css';
import ConfettiExplosion from 'react-confetti-explosion';
import { useAuth0 } from "@auth0/auth0-react";
import L from 'leaflet';
import red from '../image/pin.png';
import purple from '../image/purple.png';
import blue from '../image/blue.png';
import yellow from '../image/yellow.png';
import green from '../image/green.png';
import { useDebounce } from 'use-debounce'; 


const AddRun = () => {

  const {cityName, setCityName, data, fetchSavedPlaces, setSelectedCity, selectedCityIndex, showConfetti,
    setShowConfetti, cityCoordinates, savedPlaces} = useMapData();

  const [filteredData, setFilteredData] = useState([]);
  const [selectedMarathonType, setSelectedMarathonType] = useState({});
  const [marathonsDone, setMarathonsDone] = useState(0);
  const [statesCount, setStatesCount] = useState(0);
  const [selectedRaceType, setSelectedRaceType] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const [doneChecked, setDoneChecked] = useState(-1);
  const [showPopup, setShowPopup] = useState(false);
  const inputRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const { user, isAuthenticated } = useAuth0();
  const userId = isAuthenticated ? user?.sub : null;


  // console.log(geoJsonData.features.map((f => f.properties.name)), 'geo data')



  const marathonTypeOptions = [
    { value: '5K', label: '5K'},
    { value: '10K', label: '10K'},
    { value: 'full', label: 'Full'},
    { value: 'half', label: 'Half'},
    { value: 'ultra', label: 'Ultra'},
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (isMounted) {
          const updatedData = {
            ...data,
            features: data.features.map(feature => ({
              ...feature,
              properties: {
                ...feature.properties,
                selectedRaceType: null,
              }
            }))
          };
          setGeoJsonData(updatedData);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching GeoJSON data:', error);
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);



  // const style = (feature) => ({
  //   fillColor: getColor(feature.properties.raceType),
  //   weight: 2,
  //   opacity: 1,
  //   color: 'white',
  //   dashArray: '3',
  //   fillOpacity: 0.7,
  // });

  // // Function to determine color based on race type
  // const getColor = (raceType) => {
  //   switch (raceType) {
  //     case 'full marathon':
  //       return '#800026';
  //     case 'half marathon':
  //       return '#BD0026';
  //     case '10k':
  //       return '#E31A1C';
  //     case '5k':
  //       return '#FC4E2A';
  //     default:
  //       return '#FFEDA0';
  //   }
  // };

// const blueIcon = new L.Icon({ iconUrl: blue });
// const redIcon = new L.Icon({ iconUrl: red });
// const greenIcon = new L.Icon({ iconUrl: green });
// const purpleIcon = new L.Icon({ iconUrl: purple });
// const yellowIcon = new L.Icon({ iconUrl: yellow });


// const customIcon = (selectedRaceType) => {
//   let iconUrl;
//   switch (selectedRaceType) {
//     case '5K':
//       iconUrl = yellowIcon.options.iconUrl;
//       break;
//       case '10K':
//         iconUrl = greenIcon.options.iconUrl;
//           break;
//       case 'full':
//           iconUrl = blueIcon.options.iconUrl;
//           break;
//       case 'half':
//           iconUrl = purpleIcon.options.iconUrl;
//           break;
//       case 'ultra':
//           iconUrl = redIcon.options.iconUrl;
//           break;
//       default:
//           iconUrl = blueIcon.options.iconUrl;
//           break;
//   }

//   return new L.Icon({
//       iconUrl: iconUrl,
//       iconSize: [25, 25],
//   });
// };


// const getColor = (raceType) => {
//   console.log(raceType, 'selected??????');
//   const color = {
//     '5K': '#FFEDA0',
//     '10K': '#800026',
//     'half': '#BD0026',
//     'full': '#008000',
//     'ultra': '#E31A1C',
//   }[raceType] || '#FFEDA0';
//   console.log(`Race type: ${raceType}, Color: ${color}`);
//   return color;
// };

const getColor = () => {
  console.log(selectedRaceType, 'race type');
  let color;
  switch (selectedRaceType) {
    case '5K':
      color = '#FFEDA0';
      break;
      case '10K':
      color = '#800026';
          break;
      case 'full':
        color = '#008000';
          break;
      case 'half':
        color = '#BD0026';
          break;
      case 'ultra':
        color = '#E31A1C';
          break;
      default:
        color = '#ffffff';
          break;
  }
  return color;
}


  
  // Define the GeoJSON style
  // const style = (feature) => {
  //   console.log(`Styling feature:`, feature.properties);
  //   return {
  //     fillColor: getColor(feature.properties.selectedRaceType),
  //     weight: 2,
  //     opacity: 1,
  //     color: 'white',
  //     dashArray: '3',
  //     fillOpacity: 0.7,
  //   };
  // };

  const style = (feature) => {
    // Get the race type from GeoJSON properties
    const selectedRaceType = feature.properties.selectedRaceType;
  
    // console.log(selectedRaceType, 'selected race')
    // Assign color based on race type
    let fillColor;
    switch (selectedRaceType) {
      case '5K':
        fillColor = '#FFEDA0';
        break;
      case '10K':
        fillColor = '#800026';
        break;
      case 'full':
        fillColor = '#008000';
        break;
      case 'half':
        fillColor = '#BD0026';
        break;
      case 'ultra':
        fillColor = '#E31A1C';
        break;
      default:
        fillColor = '#ffffff';
        break;
    }
  
    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  };
 
  
  const handleChange = (e) => {
    // e.preventDefault();
    const searchWord = e.target.value;
      setCityName(e.target.value);
      if (searchWord.trim() === '') {
        setFilteredData([]);
        setIsDropdownVisible(false);
        return;
      }

      if(data && data.features && data.features.length > 0){ 
      const newFilter = data.features.filter((value) => {
      return (
    
        value.properties.city?.toLowerCase().includes(searchWord.toLowerCase()) &&
        value.properties.state?.toLowerCase().includes(searchWord.toLowerCase()) &&
        value.properties.country?.toLowerCase().includes(searchWord.toLowerCase())
  
      )
      });
    setFilteredData(newFilter);
    setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  const handleMarathonType = (index, value, type) => {
    const selectedOption = marathonTypeOptions.find((option) => option.value === value.value);
    console.log(marathonTypeOptions, 'options')
    setSelectedMarathonType((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      updatedSelections[index] = { value: value.value };
      return updatedSelections;
    });
    setSelectedRaceType(value.value);
    //find the state name from data

    const selectedState = data.features.map(feature => feature.properties.state);

    // console.log(selectedState.find(state => state === state), 'state');
    const stateName = selectedState.find(state => state === state)
    console.log(stateName, 'state name');


    setGeoJsonData((prevData) => {
      if (!prevData) return prevData;

      const selectedRunType = value.value;

      prevData.features.map((feature) => {
          if(feature.properties.name === stateName) 
            feature.properties.selectedRaceType = selectedRunType;
      });

      return { ...prevData };
    });
  };
  

  const handleCitySelection = async (selectedCity) => {
    if (selectedCity && selectedCity.properties) { 
    // Handle the city selection, e.g., saving it to the backend or updating other state
      const {city, state, country } = selectedCity.properties;
      const selectedRaceType = selectedMarathonType[0]?.value;
      setMarathonsDone((prevCount) => prevCount + 1);
  
        // Save the count of completed marathons to local storage
      localStorage.setItem('marathonsDone', marathonsDone + 1);
  
      setStatesCount((prevCount) => prevCount + 1);
      localStorage.setItem('statesCount', statesCount + 1);
      // Clear the search input and filtered data
      setCityName('');
      setFilteredData([]);
      setIsDropdownVisible(false);
      const userId = user.sub
  
      try {
        // Call the backend to save the marker with the raceType and color
        const response = await fetch('http://localhost:3000/api/places', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: selectedCity.geometry.coordinates[1],
            lon: selectedCity.geometry.coordinates[0],
            name: city,
            country,
            state,
            selectedRaceType: selectedRaceType,
            user_id: userId,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
        }
        setSelectedRaceType(selectedRaceType);
        if (doneChecked >=0){
          setShowPopup(true);
        }
        setShowConfetti(true);
        // Fetch saved places again to update the map
        fetchSavedPlaces();
        setIsDropdownVisible(false);
  
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);

      } catch (error) {
        console.error(error);
      }
  
      setGeoJsonData((prevData) => {
        if (!prevData) return prevData;
        const updatedFeatures = prevData.features.map((feature) => {
          if (feature.properties.name === state) {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                selectedRaceType: selectedRaceType,
              },
            };
          }
          console.log(feature, 'feature 2');
          return feature;
        });
        return { ...prevData, features: updatedFeatures };
      });
      // } catch (error) {
      //   console.error(error);
      // }
    } else{
        setCityName('');
        setFilteredData([]);
        setIsDropdownVisible(false);
    }
  };

  const handleCityKeyDown = (e) => {
    // Trigger the city selection logic when the Enter key is pressed
    console.log(e.key)
    if (e.key === "ArrowUp" && selectedCityIndex > 0) {
      setSelectedCity((prevIndex) => prevIndex - 1);
    } else if (e.key === "ArrowDown" && selectedCityIndex < data.length - 1) {
      setSelectedCity((prevIndex) => prevIndex + 1);
    } else if (e.key === "Enter" && selectedCityIndex >= 0) {
      // Handle selection when Enter key is pressed
      handleCitySelection(data[selectedCityIndex]);
    }
    inputRef.current.focus();
  };

return(
  <> 
  <div className={styles.search}>
                <div className={styles.searchInput}>
                  <input
                    ref={inputRef}
                    type="text"
                    className={styles.inputField}
                    placeholder="Search by City"
                    value={cityName}
                    onChange={handleChange}
                    onKeyDown={handleCityKeyDown}
                  />
                  <div className={styles.searchIcon}>
                    { cityName === "" ? ( 
                        <SearchIcon className={styles.searchIcon}/> 
                    ) : ( 
                        <CloseIcon onClick={handleCitySelection} className={styles.closeIcon} />
                    )}
                  </div>
                </div>
  </div> 
            {/* <button onClick={handleSubmit}> Search </button> */}

            {data.features !== undefined && isDropdownVisible && ( 
            <div className={styles.dropdown}>
                    <div className={styles.listCheckbox}>
                      {/* <h3>Done </h3>
                      <h3>Target</h3> */}
                      <h3>Race Type</h3>
                    </div>
                {data.features.map((d, index) => (
                  <div
                  key={index} 
                  className={styles.dropdownRow}
                  // style={{ backgroundColor: `${selectedMarathonType[index]?.color} !important`  }}
                  onClick={() => handleCitySelection(d)}
                  // onKeyDown={(e) => handleCityKeyDown(e, d)}
                  >
                    <div 
                      onClick={() => { 
                        if(doneChecked >=0) {
                          handleCitySelection(d); 
                        }
                        setIsDropdownVisible(false)}} 
                        className={styles.list}
                    >
                      {d.properties.city}, {d.properties.state}, {d.properties.country}, {d.properties.formatted}
                    </div>
                    {/* <Checkbox
                      edge="end"
                      onChange={handleToggle(index, 'done')}
                      checked={doneChecked === index}
                      className={styles.checkbox}
                    /> 
                    <Checkbox
                        edge="end"
                        onChange={handleToggle(index, 'target')}
                        checked={targetChecked === index}
                        className={styles.checkbox}
                      /> */}

                    <div className={styles.marathonTypeDropdown}>
                    <Select
                        options={marathonTypeOptions}
                        isSearchable={false}
                        value={selectedMarathonType[index]}
                        onChange={(value) => handleMarathonType(index, value) }
                        onClick={(value) => handleMarathonType(index, value) }
                    />
                    </div>
                  </div>
                ))}

{/* {geoJsonData && ( */}
<MapContainer center={[37.8, -96]} zoom={4} style={{ height: '400px', width: '100%', margin: '5rem auto auto' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
       {geoJsonData && <GeoJSON data={geoJsonData} style={style} />}
      
      {cityCoordinates && (
        <Marker position={[cityCoordinates.lat, cityCoordinates.lon]}>
          <Popup>{`Coordinates: ${cityCoordinates.lat}, ${cityCoordinates.lon}`}</Popup>
        </Marker>
      )}
      
      {/* {isAuthenticated && savedPlaces
        .filter(place => place.user_id === userId)
        .map((place, index) => (
          <Marker key={index} position={[place.lat, place.lon]}>
            <Popup>{`Saved Place ${index + 1}: Coordinates - ${place.lat}, ${place.lon}, ${place.name}, ${place.country}, ${place.selectedRaceType}`}</Popup>
          </Marker>
        ))
      } */}
    </MapContainer>
      {/* )} */}
            </div>
            )}
</>
)
};

export default AddRun;


