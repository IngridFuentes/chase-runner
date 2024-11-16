import React from 'react';
import Select from 'react-select';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../styles/Map.module.css';


const SearchInput = ({
  cityName, setCityName, data, filteredData, setFilteredData, isDropdownVisible, setIsDropdownVisible, inputRef,
  selectedMarathonType, handleMarathonType, marathonTypeOptions
}) => {
  const handleChange = (e) => {
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

  // const handleCitySelection = async (selectedCity) => {
  //   if (selectedCity && selectedCity.properties) { 
  //   // Handle the city selection, e.g., saving it to the backend or updating other state
  //     const {city, state, country } = selectedCity.properties;
  //     const selectedRaceType = selectedMarathonType[0]?.value;
  //     setMarathonsDone((prevCount) => prevCount + 1);
  
  //       // Save the count of completed marathons to local storage
  //     localStorage.setItem('marathonsDone', marathonsDone + 1);
  
  //     setStatesCount((prevCount) => prevCount + 1);
  //     localStorage.setItem('statesCount', statesCount + 1);
  //     // Clear the search input and filtered data
  //     setCityName('');
  //     setFilteredData([]);
  //     setIsDropdownVisible(false);
  //     const userId = user.sub
  
  //     try {
  //       // Call the backend to save the marker with the raceType and color
  //       const response = await fetch('http://localhost:3000/api/places', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           lat: selectedCity.geometry.coordinates[1],
  //           lon: selectedCity.geometry.coordinates[0],
  //           name: city,
  //           country,
  //           state,
  //           selectedRaceType: selectedRaceType,
  //           user_id: userId,
  //         }),
  //       });
  
  //       if (!response.ok) {
  //         throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  //       }
  //       setSelectedRaceType(selectedRaceType);
  //       if (doneChecked >=0){
  //         setShowPopup(true);
  //       }
  //       setShowConfetti(true);
  //       // Fetch saved places again to update the map
  //       fetchSavedPlaces();
  //       setIsDropdownVisible(false);
  
  //       setTimeout(() => {
  //         setShowPopup(false);
  //       }, 5000);

  //     } catch (error) {
  //       console.error(error);
  //     }
  
  //     setGeoJsonData((prevData) => {
  //       if (!prevData) return prevData;
  //       const updatedFeatures = prevData.features.map((feature) => {
  //         if (feature.properties.name === state) {
  //           return {
  //             ...feature,
  //             properties: {
  //               ...feature.properties,
  //               selectedRaceType: selectedRaceType,
  //             },
  //           };
  //         }
  //         console.log(feature, 'feature 2');
  //         return feature;
  //       });
  //       return { ...prevData, features: updatedFeatures };
  //     });
  //     // } catch (error) {
  //     //   console.error(error);
  //     // }
  //   } else{
  //       setCityName('');
  //       setFilteredData([]);
  //       setIsDropdownVisible(false);
  //   }
  // };

  // const handleCityKeyDown = (e) => {
  //   // Trigger the city selection logic when the Enter key is pressed
  //   console.log(e.key)
  //   if (e.key === "ArrowUp" && selectedCityIndex > 0) {
  //     setSelectedCity((prevIndex) => prevIndex - 1);
  //   } else if (e.key === "ArrowDown" && selectedCityIndex < data.length - 1) {
  //     setSelectedCity((prevIndex) => prevIndex + 1);
  //   } else if (e.key === "Enter" && selectedCityIndex >= 0) {
  //     // Handle selection when Enter key is pressed
  //     handleCitySelection(data[selectedCityIndex]);
  //   }
  //   inputRef.current.focus();
  // };

  return (
    <div className={styles.search}>
    <div className={styles.searchInput}>
      <input
        ref={inputRef}
        type="text"
        className={styles.inputField}
        placeholder="Search by City"
        value={cityName}
        onChange={handleChange}
      />
      <div className={styles.searchIcon}>
        {cityName === "" ? (
          <SearchIcon className={styles.searchIcon} />
        ) : (
          <CloseIcon onClick={() => setCityName('')} className={styles.closeIcon} />
        )}
      </div>
    </div>

    {data.features !== undefined && isDropdownVisible && (
      <div className={styles.dropdown}>
        {data.features.map((d, index) => (
          <div key={index} className={styles.dropdownRow}>
            <div onClick={() => setIsDropdownVisible(false)} className={styles.list}>
              {d.properties.city}, {d.properties.state}, {d.properties.country}, {d.properties.formatted}
            </div>
            <div className={styles.marathonTypeDropdown}>
              <Select
                options={marathonTypeOptions}
                isSearchable={false}
                value={selectedMarathonType[index]}
                onChange={(value) => handleMarathonType(index, value)}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
};

export default SearchInput;
