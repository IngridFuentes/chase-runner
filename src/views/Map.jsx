import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet library
import red from '../image/pin.png';
import purple from '../image/purple.png';
import blue from '../image/blue.png';
import yellow from '../image/yellow.png';
import green from '../image/green.png';
import ConfettiExplosion from 'react-confetti-explosion';
import styles from '../styles/Map.module.css';
import useMapData from '../hooks/useMapData';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import Banner from "../components/Banner";
// import states from '../data/states.json';
import { useAuth0 } from "@auth0/auth0-react";


const Map = () => {
  const {
    cityName,
    setCityName,
    selectedCity,
    setSelectedCity,
    country,
    setCountry,
    cityCoordinates,
    mapCenter,
    savedPlaces,
    showConfetti,
    setShowConfetti,
    handleInputSearch,
    handleSubmit,
    suggestions,
    handleKeyDown,
    saveCityToBackend,
    setSuggestions,
    handleSuggestionClick,
    selectedCityIndex,
    handleCitySearch,
    data,
    setData,
    fetchSavedPlaces,
    fetchCitiesFromAPI
  } = useMapData();

  const [filteredData, setFilteredData] = useState([]);
  // const [checked, setChecked] = useState([]);
  const [doneChecked, setDoneChecked] = useState(-1);
  const [targetChecked, setTargetChecked] = useState(-1);
  const [selectedMarathonType, setSelectedMarathonType] = useState({});
  const [selectedRaceType, setSelectedRaceType] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const [marathonsDone, setMarathonsDone] = useState(0);
  const [targetMarathons, setTargetMarathons] = useState(0);


  const [showPopup, setShowPopup] = useState(false);


  const { user, isAuthenticated } = useAuth0();
  const userId = isAuthenticated ? user?.sub : null;

  useEffect(() => {
    // Retrieve the count of completed marathons from local storage when the component mounts
    const storedMarathonsDone = localStorage.getItem('marathonsDone');
    if (storedMarathonsDone) {
      setMarathonsDone(parseInt(storedMarathonsDone));
    }
  }, []);

  const handleToggle = (index, type) => () => {
    if (type === 'done') {
      setDoneChecked(doneChecked === index ? -1 : index);
      if (targetChecked === index) {
        setTargetChecked(-1);
      }
    } else if (type === 'target') {
      setTargetChecked(targetChecked === index ? -1 : index);
      setTargetMarathons((prevCount) => prevCount + 1);
      if (doneChecked === index) {
        setDoneChecked(-1);
      }
    }
  };

  const marathonTypeOptions = [
    { value: '5K', label: '5K'},
    { value: '10K', label: '10K'},
    { value: 'full', label: 'Full'},
    { value: 'half', label: 'Half'},
    { value: 'ultra', label: 'Ultra'},
  ];

  const handleMarathonType = (index, value, type) => {
    const selectedOption = marathonTypeOptions.find((option) => option.value === value.value);
    setSelectedMarathonType((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      updatedSelections[index] = { value: value.value };
      return updatedSelections;

    });
    setSelectedRaceType(value.value);

  };

const blueIcon = new L.Icon({ iconUrl: blue });
const redIcon = new L.Icon({ iconUrl: red });
const greenIcon = new L.Icon({ iconUrl: green });
const purpleIcon = new L.Icon({ iconUrl: purple });
const yellowIcon = new L.Icon({ iconUrl: yellow });


const customIcon = (selectedRaceType) => {
  let iconUrl;
  // const raceType = selectedMarathonType[0]?.value;
  // console.log(raceType, 'race type')
  switch (selectedRaceType) {
    case '5K':
      iconUrl = yellowIcon.options.iconUrl;
      break;
      case '10K':
        iconUrl = greenIcon.options.iconUrl;
          break;
      case 'full':
          iconUrl = blueIcon.options.iconUrl;
          break;
      case 'half':
          iconUrl = purpleIcon.options.iconUrl;
          break;
      case 'ultra':
          iconUrl = redIcon.options.iconUrl;
          break;
      default:
          // Default to blue icon if race type is not recognized
          iconUrl = blueIcon.options.iconUrl;
          break;
  }

  return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [25, 25],
  });
};

const handleChange = (e) => {
  // e.preventDefault();
  const searchWord = e.target.value;
    setCityName(e.target.value);
    if(data && data.features && data.features.length > 0){ 
    const newFilter = data.features.filter((value) => {
    return (
  
      value.properties.city?.toLowerCase().includes(searchWord.toLowerCase()) &&
      value.properties.state?.toLowerCase().includes(searchWord.toLowerCase()) &&
      value.properties.country?.toLowerCase().includes(searchWord.toLowerCase())

    )
    });
  setFilteredData(newFilter);
  }
}

const handleCitySelection = async (selectedCity) => {
  // Handle the city selection, e.g., saving it to the backend or updating other state
  const {city, state, country } = selectedCity.properties;
  const selectedRaceType = selectedMarathonType[0]?.value;
  setMarathonsDone((prevCount) => prevCount + 1);

    // Save the count of completed marathons to local storage
  localStorage.setItem('marathonsDone', marathonsDone + 1);

  // Clear the search input and filtered data
  setCityName('');
  setFilteredData([]);
  // setSelectedRaceType(selectedRaceType);

  // console.log('Selected City:', city, state, country, selectedRaceType);
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
        selectedracetype: selectedRaceType,
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
};

const handleCityKeyDown = (e, selectedCity) => {
  // Trigger the city selection logic when the Enter key is pressed
  console.log(e.key)
 if(e.key === "ArrowUp" && selectedCity > 0 ){
   setSelectedCity(prev => prev -1)
 }
 else if ( e.key === "ArrowDown" && selectedCity < data.length - 1)
 {
  setSelectedCity(prev => prev + 1)
 }
 else if(e.key === "Enter" && selectedCity >=0){

 }
};
const handleClosePopup = () => {
  setShowPopup(false);
};
  return (
    <div>
          <Banner />
          {/* <div>Marathons Done so far: {marathonsDone}</div> */}
          <div className={styles.welcomeName}> Welcome, {user.nickname}! </div>
          <br />
            <div className={styles.search}>
                <div className={styles.searchInput}>
                  <input
                    type="text"
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
                      <h3>Done </h3>
                      <h3>Target</h3>
                      <h3>Race Type</h3>
                    </div>
                {data.features.map((d, index) => (
                  <div
                  key={index} 
                  className={styles.dropdownRow}
                  // style={{ backgroundColor: `${selectedMarathonType[index]?.color} !important`  }}
                  // onClick={() => handleCitySelection(d)}
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
                    <Checkbox
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
                      />

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
            </div>
            )}

          {showPopup && (
                      <div className={styles.popup}>
                      <div className={styles.popupContent}>
                        <span className={styles.close} onClick={handleClosePopup}>&times;</span>
                        <h2>Congratulations!</h2>
                        <p>You have completed a race.</p>
                      </div>
                    </div>
          )}

          {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={2000}
                angle={180} 
                gravity={0.5}
                zIndex={5000} 
          />}
          
          {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={3000}
                angle={90} 
                gravity={0.5}
                zIndex={2000} 
          />}
            {/* {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={2000}
                angle={0} 
                gravity={0.5}
            />}
            {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={3000}
                angle={90} 
                gravity={0.5}
            />}
             {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={2000}
                angle={180} 
                gravity={0.5}
            />}
            {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={3000}
                angle={270} 
                gravity={0.5}
            />} */}
            
            <div className={styles.mapBackground}>      
              <MapContainer center={mapCenter} zoom={3} style={{ height: '400px', width: '90%', marginTop: '5rem', margin: '5rem auto auto', boxShadow: '0 0 10px rgb(40 173 57 / 70%)'}}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url= 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                {cityCoordinates && (
                  <Marker position={[cityCoordinates.lat, cityCoordinates.lon]} icon={customIcon(cityCoordinates.selectedracetype)}>
                    <Popup>{`Coordinates: ${cityCoordinates.lat}, ${cityCoordinates.lon}`}</Popup>
                  </Marker>
                )}
                {isAuthenticated && savedPlaces
                .filter(place => place.user_id === userId)
                .map((place, index) => (
                  <Marker key={index} position={[place.lat, place.lon, place.name]} icon={customIcon(place.selectedracetype)}>
                    <Popup>{`Saved Place ${index + 1}: Coordinates - ${place.lat}, ${place.lon}, ${place.name}, ${place.country}, ${place.selectedracetype}`}</Popup>
                  </Marker>
                ))}
              </MapContainer>

            </div>
            <div className={styles.cardContainer}> 
                <div className={styles.card}>
                    <h2>Marathons Run So Far</h2>
                    <div className={styles.marathonCount}>{marathonsDone}</div>
                </div>
                <div className={styles.secondCard}>
                    <h2>Marathons you'll be running in the future</h2>
                    <div className={styles.marathonCount}>{targetMarathons}</div>
                </div>
            </div>
      </div>
  );
};

export default Map;