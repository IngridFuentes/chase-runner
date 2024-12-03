import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import red from "../image/pin.png";
import purple from "../image/purple.png";
import blue from "../image/blue.png";
import yellow from "../image/yellow.png";
import green from "../image/green.png";
import ConfettiExplosion from "react-confetti-explosion";
import styles from "../styles/Map.module.css";
import useMapData from "../hooks/useMapData.js";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import Banner from "../components/Banner.js";
import { useAuth0 } from "@auth0/auth0-react";
import AddRun from "./AddRun.jsx";
import SearchInput from "./SearchInput.jsx";
import RunningShoesSpinner from "./RunningShoesSpinner.jsx";

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
    setSavedPlaces,
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
    saveGeoJsonData,
    fetchGeoJsonData,
  } = useMapData();

  const [filteredData, setFilteredData] = useState([]);
  // const [checked, setChecked] = useState([]);
  const [doneChecked, setDoneChecked] = useState(-1);
  const [selectedMarathonType, setSelectedMarathonType] = useState({});
  const [selectedRaceType, setSelectedRaceType] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const [marathonsDone, setMarathonsDone] = useState(0);
  const [statesCount, setStatesCount] = useState(0);
  const inputRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [debouncedSearchWord, setDebouncedSearchWord] = useState(cityName);
  const [loading, setLoading] = useState(true);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // This will be called when user is authenticated
    if (isAuthenticated) {
      // console.log(isAuthenticated, "authenticated? on map");
      // console.log("User authenticated:", user);
    }
  }, [isAuthenticated, user]);

  const marathonTypeOptions = [
    { value: "5K", label: "5K" },
    { value: "10K", label: "10K" },
    { value: "Full", label: "Full" },
    { value: "Half", label: "Half" },
    { value: "Ultra", label: "Ultra" },
  ];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (isMounted) {
          const updatedData = {
            ...data,
            features: data.features.map((feature) => ({
              ...feature,
              properties: {
                ...feature.properties,
                selectedRaceType: null,
              },
            })),
          };
          setGeoJsonData(updatedData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching GeoJSON data:", error);
        }
      }
      setLoading(false);
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarathonType = (index, value, type) => {
    const selectedOption = marathonTypeOptions.find(
      (option) => option.value === value.value
    );
    // console.log(marathonTypeOptions, "options");
    setSelectedMarathonType((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      updatedSelections[index] = { value: value.value };
      return updatedSelections;
    });
    setSelectedRaceType(value.value);
    //find the state name from data

    const selectedState = data.features.map(
      (feature) => feature.properties.state
    );

    // console.log(selectedState.find(state => state === state), 'state');
    const stateName = selectedState.find((state) => state === state);
    // console.log(stateName, "state name");

    setGeoJsonData((prevData) => {
      if (!prevData) return prevData;

      const selectedRunType = value.value;

      prevData.features.map((feature) => {
        if (feature.properties.name === stateName)
          feature.properties.selectedRaceType = selectedRunType;
      });

      handleCitySelection(data.features[index], selectedRunType);

      return { ...prevData };
    });
  };

  const getColor = () => {
    // console.log(selectedRaceType, "race type");
    let color;
    switch (selectedRaceType) {
      case "5K":
        color = "#FFEDA0";
        break;
      case "10K":
        color = "#800026";
        break;
      case "Full":
        color = "#008000";
        break;
      case "Half":
        color = "#BD0026";
        break;
      case "Ultra":
        color = "#E31A1C";
        break;
      default:
        color = "#ffffff";
        break;
    }
    return color;
  };

  const style = (feature) => {
    // Get the race type from GeoJSON properties
    const selectedRaceType = feature.properties.selectedRaceType;

    // console.log(selectedRaceType, 'selected race')
    // Assign color based on race type
    let fillColor;
    switch (selectedRaceType) {
      case "5K":
        fillColor = "#0000FF"; //blue
        break;
      case "10K":
        fillColor = "#FFA500"; //orange
        break;
      case "Full":
        fillColor = "#008000"; //green
        break;
      case "Half":
        fillColor = "#800080"; //purple
        break;
      case "Ultra":
        fillColor = "#EC0003"; //red
        break;
      default:
        fillColor = "#ffffff";
        break;
    }

    return {
      fillColor: fillColor,
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  useEffect(() => {
    localStorage.setItem("marathonsDone", 0);
    localStorage.setItem("statesCount", 0);
    const savedGeoJsonData = localStorage.getItem("geoJsonData");
    if (savedGeoJsonData) {
      setGeoJsonData(JSON.parse(savedGeoJsonData));
    } else {
      // Initialize with empty data or default value if nothing is found
      setGeoJsonData([]);
    }

    const storedMarathonsDone = localStorage.getItem("marathonsDone");
    if (storedMarathonsDone) {
      setMarathonsDone(parseInt(storedMarathonsDone, 10));
    } else {
      setMarathonsDone(0);
    }

    const statesCount = localStorage.getItem("statesCount");
    if (statesCount) {
      setStatesCount(parseInt(statesCount, 10));
    } else {
      setStatesCount(0);
    }
  }, []);

  const handleChange = (e) => {
    const searchWord = e.target.value;
    setCityName(searchWord);

    if (searchWord.trim() === "") {
      setFilteredData([]);
      setIsDropdownVisible(false);
      return;
    }

    if (debouncedSearchWord) {
      filterCities(debouncedSearchWord);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchWord(cityName);
    }, 100);

    return () => {
      clearTimeout(handler);
    };
  }, [cityName]);

  const filterCities = (searchWord) => {
    if (data && data.features && data.features.length > 0) {
      const newFilter = data.features.filter((value) => {
        return (
          value.properties.city
            ?.toLowerCase()
            .includes(searchWord.toLowerCase()) &&
          value.properties.state
            ?.toLowerCase()
            .includes(searchWord.toLowerCase()) &&
          value.properties.country
            ?.toLowerCase()
            .includes(searchWord.toLowerCase())
        );
      });
      setFilteredData(newFilter);
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
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
      case "5K":
        iconUrl = yellowIcon.options.iconUrl;
        break;
      case "10K":
        iconUrl = greenIcon.options.iconUrl;
        break;
      case "full":
        iconUrl = blueIcon.options.iconUrl;
        break;
      case "half":
        iconUrl = purpleIcon.options.iconUrl;
        break;
      case "ultra":
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

  // const handleChange = (e) => {
  //   // e.preventDefault();
  //   const searchWord = e.target.value;
  //     setCityName(e.target.value);
  //     if(data && data.features && data.features.length > 0){
  //     const newFilter = data.features.filter((value) => {
  //     return (

  //       value.properties.city?.toLowerCase().includes(searchWord.toLowerCase()) &&
  //       value.properties.state?.toLowerCase().includes(searchWord.toLowerCase()) &&
  //       value.properties.country?.toLowerCase().includes(searchWord.toLowerCase())

  //     )
  //     });
  //   setFilteredData(newFilter);
  //   }
  // }

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
  //           selectedracetype: selectedRaceType,
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
  //   } else{
  //       setCityName('');
  //       setFilteredData([]);
  //       setIsDropdownVisible(false);
  //   }
  // };

  // const handleCityKeyDown = (e, selectedCity) => {
  //   // Trigger the city selection logic when the Enter key is pressed
  //   console.log(e.key)
  //  if(e.key === "ArrowUp" && selectedCity > 0 ){
  //    setSelectedCity(prev => prev -1)
  //  }
  //  else if ( e.key === "ArrowDown" && selectedCity < data.length - 1)
  //  {
  //   setSelectedCity(prev => prev + 1)
  //  }
  //  else if(e.key === "Enter" && selectedCity >=0){

  //  }
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

  // const handleCitySelection = async (selectedCity, selectedRunType) => {
  //   if (selectedCity && selectedCity.properties) {
  //   // Handle the city selection, e.g., saving it to the backend or updating other state
  //     const {city, state, country } = selectedCity.properties;

  //     // console.log(selectedCity, 'selected city')

  //     const selectedRaceType = selectedRunType;

  //     setMarathonsDone((prevCount) => prevCount + 1);

  //       // Save the count of completed marathons to local storage
  //     localStorage.setItem('marathonsDone', marathonsDone + 1);

  //     setStatesCount((prevCount) => prevCount + 1);
  //     localStorage.setItem('statesCount', statesCount + 1);
  //     // Clear the search input and filtered data
  //     setCityName('');
  //     setFilteredData([]);
  //     setIsDropdownVisible(false);
  //     // const userId = user.sub

  //   //   const updatedStateFeature = geoJsonData.features.find((feature) => feature.properties.name === state);

  //   //   if (updatedStateFeature) {
  //   //     updatedStateFeature.properties.selectedRaceType = selectedRaceType;

  //   //   setGeoJsonData((prevData) => {
  //   //     if (!prevData) return prevData;
  //   //     const updatedFeatures = prevData.features.map((feature) =>
  //   //       feature.properties.name ===state ? updatedStateFeature : feature);

  //   //       console.log(updatedFeatures, 'updated features');
  //   //     return { ...prevData, features: updatedFeatures };
  //   //   });
  //   // }

  //   const updatedGeoJsonData = {
  //     ...geoJsonData,
  //     features: geoJsonData.features.map((feature) => {
  //       if (feature.properties.name === state) {
  //         return {
  //           ...feature,
  //           properties: {
  //             ...feature.properties,
  //             selectedRaceType: selectedRaceType,
  //           },
  //         };
  //       }
  //       return feature;
  //     }),
  //   };

  //   setGeoJsonData(updatedGeoJsonData);
  //   localStorage.setItem('geoJsonData', JSON.stringify(updatedGeoJsonData));

  //     // try {
  //     //   // Call the backend to save the marker with the raceType and color
  //     //   const response = await fetch('http://localhost:3000/api/places', {
  //     //     method: 'POST',
  //     //     headers: {
  //     //       'Content-Type': 'application/json',
  //     //     },
  //     //     body: JSON.stringify({
  //     //       lat: selectedCity.geometry.coordinates[1],
  //     //       lon: selectedCity.geometry.coordinates[0],
  //     //       name: city,
  //     //       country,
  //     //       state,
  //     //       selectedracetype: selectedRaceType,
  //     //       user_id: userId,
  //     //     }),
  //     //   });

  //     try {
  //       let color;
  //   switch (selectedRaceType) {
  //     case '5K':
  //       color = '#0000FF'; // blue
  //       break;
  //     case '10K':
  //       color = '#FFFF00'; // yellow
  //       break;
  //     case 'full':
  //       color = '#008000'; // green
  //       break;
  //     case 'half':
  //       color = '#800080'; // purple
  //       break;
  //     case 'ultra':
  //       color = '#EC0003'; // red
  //       break;
  //     default:
  //       color = '#ffffff'; // default color
  //       break;
  //   }
  //         // Call the backend to save the marker with the raceType and color
  //         const response = await fetch('http://localhost:3000/geojson/', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({
  //             lat: selectedCity.geometry.coordinates[1],
  //             lon: selectedCity.geometry.coordinates[0],
  //             name: state,
  //             // country,
  //             // user_id: userId,
  //             // description,
  //             geojson: geoJsonData,
  //             race_type: selectedRaceType,
  //             color: color,
  //           }),
  //     });

  //       if (!response.ok) {
  //         throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  //       }
  //       setSelectedRaceType(selectedRaceType);
  //       setShowPopup(true);
  //       setShowConfetti(true);
  //       // Fetch saved places again to update the map
  //       fetchSavedPlaces();
  //       fetchGeoJsonData();
  //       setIsDropdownVisible(false);

  //       setTimeout(() => {
  //         setShowPopup(false);
  //       }, 5000);
  //     }
  //     catch (error) {
  //       console.error(error);
  //     }

  //     // setGeoJsonData((prevData) => {
  //     //   if (!prevData) return prevData;
  //     //   const updatedFeatures = prevData.features.map((feature) => {
  //     //     if (feature.properties.name === state) {
  //     //       return {
  //     //         ...feature,
  //     //         properties: {
  //     //           ...feature.properties,
  //     //           selectedRaceType: selectedRaceType,
  //     //         },
  //     //       };
  //     //     }
  //     //     return feature;
  //     //     // console.log(feature, 'feature 2');
  //     //   });
  //     //   // console.log(prevData, 'prev data')
  //     //   return { ...prevData, features: updatedFeatures };
  //     // });
  //   //  }
  //   //  else {
  //   //     setCityName('');
  //   //     setFilteredData([]);
  //   //     setIsDropdownVisible(false);
  //   // }
  // };
  // }

  // console.log(user.sub, "user map.js");
  // const userId = user.sub;

  const handleCitySelection = async (selectedCity, selectedRunType) => {
    if (
      selectedCity &&
      selectedCity.properties &&
      selectedCity.geometry &&
      selectedCity.geometry.coordinates
    ) {
      const { city, state, country } = selectedCity.properties;
      const selectedRaceType = selectedRunType;
      const description = `Event ${selectedRaceType}`;

      const userId = user.sub;

      // console.log(userId, "user id");

      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      setMarathonsDone((prevCount) => prevCount + 1);
      localStorage.setItem("marathonsDone", marathonsDone + 1);
      setStatesCount((prevCount) => prevCount + 1);
      localStorage.setItem("statesCount", statesCount + 1);

      // Filter geoJsonData to only include the selected state
      const selectedStateData = geoJsonData.features.find(
        (feature) => feature.properties.name === state
      );

      if (selectedStateData) {
        // Create a new GeoJSON object that only includes the selected state's data
        const updatedGeoJsonData = {
          type: "FeatureCollection",
          features: [
            {
              ...selectedStateData,
              properties: {
                ...selectedStateData.properties,
                selectedRaceType: selectedRaceType,
              },
            },
          ],
        };

        // console.log("Updated GeoJSON Data:", updatedGeoJsonData);

        try {
          let color;
          switch (selectedRaceType) {
            case "5K":
              color = "#0000FF";
              break;
            case "10K":
              color = "#FFA500";
              break;
            case "Full":
              color = "#008000";
              break;
            case "Half":
              color = "#800080";
              break;
            case "Ultra":
              color = "#EC0003";
              break;
            default:
              color = "#ffffff";
              break;
          }
          const token = await getAccessTokenSilently();
          // console.log("runs route frontend");
          const response = await fetch(
            "https://chase-runner-backend.vercel.app/runs",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                lat: selectedCity.geometry.coordinates[1],
                lon: selectedCity.geometry.coordinates[0],
                name: selectedStateData.properties.name,
                description: description,
                geojson: {
                  type: selectedStateData.geometry.type,
                  coordinates: selectedStateData.geometry.coordinates,
                },
                race_type: selectedRaceType,
                color: color,
                user_id: userId,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `${response.status} ${
                response.statusText
              }: ${await response.text()}`
            );
          }

          setSelectedRaceType(selectedRaceType);
          setShowPopup(true);
          setShowConfetti(true);

          fetchSavedPlaces();
          // fetchGeoJsonData();
          setCityName("");
          setFilteredData([]);
          setIsDropdownVisible(false);

          setTimeout(() => {
            setShowPopup(false);
          }, 5000);
        } catch (error) {
          console.error("Error saving data to backend:", error);
        }
      } else {
        console.error("Selected state data not found");
      }
    } else {
      console.error("Selected city does not have geometry or coordinates");
    }
  };

  const renderSavedPlaces = () => {
    return savedPlaces.map((place, index) => {
      try {
        // console.log(place.color, 'place geojson')
        if (place.geojson && place.geojson.coordinates) {
          return (
            <GeoJSON
              key={index}
              data={place.geojson}
              style={{ color: place.color }}
            />
          );
        } else {
          // console.error("Invalid geojson data:", place.geojson);
          return null;
        }
      } catch (error) {
        // console.error("Error rendering GeoJSON:", error, place.geojson);
        return null;
      }
    });
  };

  const handleCityKeyDown = (e) => {
    // Trigger the city selection logic when the Enter key is pressed
    // console.log(e.key);
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

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  //test

  const getData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve("data"), 1000);
    });
  };
  getData().then((response) => console.log(response));

  const handleDeletePlace = async (id) => {
    try {
      await fetch(`http://localhost:3000/geojson/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedPlaces = savedPlaces.filter((place) => place.id !== id);
      setSavedPlaces(updatedPlaces);
    } catch (error) {
      console.error("Failed to delete the place:", error);
    }
  };

  if (loading) {
    return <RunningShoesSpinner />;
  }

  return (
    <div>
      <Banner />
      {/* <div>Marathons Done so far: {marathonsDone}</div> */}
      {/* <div className={styles.welcomeName}> Welcome, {user.nickname}! </div> */}
      <br />
      {/* <div className={styles.buttonContainer}>
        <button
          className={styles.buttonAddRun}
          onClick={() => setShowComponent(!showComponent)}
        >
          Add Run
        </button>
        {showComponent && <AddRun />}
      </div> */}
      {/* <div className={styles.search}>
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
              </div>  */}
      {/* <button onClick={handleSubmit}> Search </button> */}

      {/* {data.features !== undefined && isDropdownVisible && ( 
            <div className={styles.dropdown}>
                    <div className={styles.listCheckbox}>
                      <h3>Done </h3>
                      <h3>Target</h3>
                      <h3>Race Type</h3>
                    </div>
                {data.features.map((d, index) => (
                  <div
                  key={index} 
                  className={styles.dropdownRow} */}

      {/* ---------------- */}
      {/* // style={{ backgroundColor: `${selectedMarathonType[index]?.color} !important`  }}
                  // onClick={() => handleCitySelection(d)}
                  // onKeyDown={(e) => handleCityKeyDown(e, d)}
                  > */}
      {/* ---------------- */}
      {/* <div 
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
            )} */}
      {/* ------------------------------------------------------------------------------------------------------- */}
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
            {cityName === "" ? (
              <SearchIcon className={styles.searchIcon} />
            ) : (
              <CloseIcon
                onClick={() => {
                  setCityName("");
                  setFilteredData([]);
                  setIsDropdownVisible(false);
                }}
                className={styles.closeIcon}
              />
            )}
          </div>
        </div>
      </div>

      {data.features !== undefined && isDropdownVisible && (
        <div className={styles.dropdown}>
          <div className={styles.listCheckbox}>
            {/* <h3>Done </h3>
                      <h3>Target</h3> */}
            <h3 className={styles.raceTypeSentence}>Race Type</h3>
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
                  handleCitySelection(d);

                  setIsDropdownVisible(false);
                }}
                className={styles.list}
              >
                {d.properties.city}, {d.properties.state},{" "}
                {d.properties.country}, {d.properties.formatted}
              </div>

              <div className={styles.marathonTypeDropdown}>
                <Select
                  options={marathonTypeOptions}
                  isSearchable={false}
                  value={selectedMarathonType[index]}
                  onChange={(value) => handleMarathonType(index, value)}
                  onClick={(value) => handleMarathonType(index, value)}
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                      color: state.isFocused ? "#000" : "#333",
                      cursor: "pointer",
                      zIndex: 1000,
                    }),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------------------------------------------------- */}

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={handleClosePopup}>
              &times;
            </span>
            <h2>Congratulations!</h2>
            <p>You have completed a race.</p>
          </div>
        </div>
      )}

      {showConfetti && (
        <ConfettiExplosion
          force={0.8}
          duration={5000}
          particleCount={400}
          width={2000}
          angle={180}
          gravity={2}
          zIndex={5000}
        />
      )}

      {showConfetti && (
        <ConfettiExplosion
          force={0.8}
          duration={3000}
          particleCount={400}
          width={2000}
          angle={0}
          gravity={0.5}
        />
      )}
      {showConfetti && (
        <ConfettiExplosion
          force={0.8}
          duration={3000}
          particleCount={400}
          width={3000}
          angle={90}
          gravity={0.5}
        />
      )}
      {showConfetti && (
        <ConfettiExplosion
          force={0.8}
          duration={3000}
          particleCount={400}
          width={2000}
          angle={180}
          gravity={0.5}
        />
      )}
      {showConfetti && (
        <ConfettiExplosion
          force={0.8}
          duration={3000}
          particleCount={400}
          width={3000}
          angle={270}
          gravity={0.5}
        />
      )}

      <div className={styles.mapBackground}>
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          // style={{ height: "500px", width: "50%", margin: "3rem auto auto" }}
          className={styles.leafletContainer}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {savedPlaces.map((place) => (
            <GeoJSON
              key={place.id}
              data={place.geojson}
              style={{ color: place.color }}
            >
              <Popup>
                {place.name}: {place.description}
                <button
                  onClick={() => handleDeletePlace(place.id)}
                  style={{ marginLeft: "10px", color: "red", border: "none" }}
                >
                  Delete
                </button>
              </Popup>
            </GeoJSON>
          ))}
        </MapContainer>
      </div>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h2 className={styles.cardSentence}>Runs So Far</h2>
          <div className={styles.marathonCount}>{savedPlaces.length}</div>
        </div>
        <div className={styles.secondCard}>
          <h2 className={styles.cardSentence}>Number of States</h2>
          <div className={styles.marathonCount}>{savedPlaces.length}</div>
        </div>
      </div>
    </div>
  );
};

export default Map;
