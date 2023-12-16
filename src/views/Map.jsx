import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet library
import image from '../image/pin.png';
import ConfettiExplosion from 'react-confetti-explosion';
import styles from '../styles/Map.module.css';
import useMapData from '../hooks/useMapData';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';


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
    fetchCitiesFromAPI
  } = useMapData();

  const [filteredData, setFilteredData] = useState([]);
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if(currentIndex === -1){
      newChecked.push(value);
    }else{
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  // console.log(data, 'dataaaaaa')
  // console.log(data.features.filter((value) => console.log(value.properties.city.toLowerCase().includes(value))), 'newdata')

// console.log(suggestions, 'sugg')
//   // const [cityName, setCityName] = useState('');
//   // const [cityCoordinates, setCityCoordinates] = useState(null);
//   // const [mapCenter, setMapCenter] = useState([39.106667, -94.676392]); // Default map center
//   // const [savedPlaces, setSavedPlaces] = useState([]);
//   // const [showConfetti, setShowConfetti] = useState(false);

//   // const handleCitySearch = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `https://api.geoapify.com/v1/geocode/search?text=${cityName}&lang=en&limit=10&type=city&apiKey=63f9e025a41e4c2eb7b9fea7f557a9b5`
//   //     );
//   //     const data = await response.json();
//   //       console.log(data.features[0].properties, 'data')
//   //       const { lat, lon } = data.features[0].properties;
//   //       setCityCoordinates({ lat, lon });

//   //   const res = await fetch('http://localhost:3000/api/places', {
//   //       method: 'POST',
//   //       headers: {
//   //           'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ lat, lon, name: cityName  }),
//   //   });
//   //   if(!res.ok){
//   //       throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`)
//   //   }
//   //   setCityName('');
//   //   setShowConfetti(true);
//   //   setTimeout(() => {
//   //       setShowConfetti(false);
//   //     }, 2000);

//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   // };
//   // useEffect(() => {
//   //   //Fetch saved places from the backend
//   //   const fetchSavedPlaces = async () => {
//   //     try {
//   //         const response = await fetch('http://localhost:3000/api/places');
//   //         if(response.ok) {
//   //           const data = await response.json();
//   //           setSavedPlaces(data);
//   //           console.log(data, 'hi');
//   //         } else{
//   //           throw new Error('Network response was not ok.');
//   //         }
//   //       // const data = await response.json();
//   //       // console.log(data, 'backend data')
//   //       // setSavedPlaces(data);
//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   };

//   //   fetchSavedPlaces();
//   // }, []);

  const customIcon = new L.Icon({
    iconUrl: image,
    iconSize: [25, 25], 
  });


//   // const onGridReady = (params) => {
//   //   setGridApi(params.api);
//   // }


//   // const suggestionsData = suggestions.map((city, index) => ({ id:index, city}));
//   // console.log(suggestionsData, 'suggestions')

//   // const handleInputChange = suggestions.length > 0 && (
//   //   <ul className={styles.suggestions}>
//   //     {suggestions.map((city, index) => ( 
//   //       <li key={index} onClick={() => handleSuggestionClick(city)}>
//   //         {city}
//   //       </li>
//   //     ))}
//   //   </ul>
//   // )
//   // console.log(handleInputChange.props.children, 'change')

// const filteredData = data.features.map((d, index) => {
//   // return d.properties
//   console.log(d.properties, 'prop')

// })
// console.log(filteredData, 'data2')

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
  // setCityName(searchWord);
}
// const onSearch = (selectedCity) => {
//   console.log(selectedCity,'selected')
//   setSelectedCity(selectedCity);
//   const timeoutId = setTimeout(() => {
//     setSuggestions([]);
//   }, 300);
//   return () => clearTimeout(timeoutId);
// }

const handleCitySelection = (selectedCity) => {
  // Handle the city selection, e.g., saving it to the backend or updating other state
  const {city, state, country } = selectedCity.properties;
  // console.log('Selected City:', selectedCity.properties.city, selectedCity.properties.state, selectedCity.properties.country);
  // Clear the search input and filtered data
  setCityName('');
  setFilteredData([]);
  return {city, state, country};
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
  return (
    <div>
          
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

            {data.features !== undefined && ( 
            <div className={styles.dropdown}>
                {data.features.map((d, index) => (
                  <div
                  key={index} 
                  className={styles.dropdownRow}
                  // onClick={() => handleCitySelection(d)}
                  // onKeyDown={(e) => handleCityKeyDown(e, d)}
                  >
                    <div onClick={() => handleCitySelection(d)} className={styles.list}>
                    {d.properties.city}, {d.properties.state}, {d.properties.country}, {d.properties.formatted}
                    </div>
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(index)}
                      checked={checked.indexOf(index) !== -1}
                      className={styles.checkbox}
                    />
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(index)}
                      checked={checked.indexOf(index) !== -1}
                      className={styles.checkbox}
                    />
                  </div>
                ))}
            </div>
            )}
            {/* { suggestions.length !== 0 && ( 
              <div className={styles.dropdown}>
                {suggestions.map((result, index) => (
                      <div 
                        key={index} 
                        className={styles.dropdownRow}
                        // onClick={() => onSearch(result.props.children)} 
                        > 
                        <p> {result.props.children} </p> 
                      </div>
                ))}
              </div>
            )
            } */}

          {showConfetti && <ConfettiExplosion 
                force={0.8}
                duration={3000}
                particleCount={400}
                width={2000}
                angle={120} 
                gravity={0.5}
            />}
      <MapContainer center={mapCenter} zoom={3} style={{ height: '400px', width: '100%', marginTop: '5rem'}}>
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
            <Popup>{`Saved Place ${index + 1}: Coordinates - ${place.lat}, ${place.lon}, ${place.name}, ${place.country}`}</Popup>
          </Marker>
        ))}
         
      </MapContainer>
    </div>
  );
};

export default Map;

