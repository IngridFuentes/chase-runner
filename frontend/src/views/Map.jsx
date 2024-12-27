import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
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
import Banner from "../components/Banner.js";
import { useAuth0 } from "@auth0/auth0-react";
import RunningShoesSpinner from "./RunningShoesSpinner.jsx";

const Map = () => {
  const {
    cityName,
    setCityName,
    selectedCity,
    setSelectedCity,
    // mapCenter,
    savedPlaces,
    setSavedPlaces,
    showConfetti,
    setShowConfetti,
    selectedCityIndex,
    handleCitySearch,
    data,
    // setData,
    fetchSavedPlaces,
  } = useMapData();

  const [filteredData, setFilteredData] = useState([]);
  const [selectedMarathonType, setSelectedMarathonType] = useState({});
  const [selectedRaceType, setSelectedRaceType] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const [marathonsDone, setMarathonsDone] = useState(0);
  const [statesCount, setStatesCount] = useState(0);
  const inputRef = useRef(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
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
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (cityName.trim() !== "") {
        try {
          const data = await handleCitySearch(cityName);
          filterCities(cityName, data);
        } catch (error) {
          console.error("Error during search:", error);
        }
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [cityName, handleCitySearch]);

  const filterCities = (searchWord, data) => {
    if (data && data.features && data.features.length > 0) {
      const filteredData = data.features.filter((value) => {
        const city = value.properties.city?.toLowerCase();
        const search = searchWord.toLowerCase();
        const cityMatch = city && city.includes(search);
        const stateMatch = value.properties.state
          ?.toLowerCase()
          .includes(searchWord.toLowerCase());
        if (city && cityMatch === false) {
          return "";
        } else {
          return cityMatch;
        }
      });
      setFilteredData(filteredData);
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
            // "http://localhost:3000/runs",
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
          setCityName("");
          setFilteredData([]);
          setIsDropdownVisible(false);

          setTimeout(() => {
            setShowPopup(false);
            setShowConfetti(false);
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

  const handleDeletePlace = async (id) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `https://chase-runner-backend.vercel.app/runs/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete place with id: ${id}`);
      }

      const updatedPlaces = savedPlaces.filter((place) => place.id !== id);
      setSavedPlaces(updatedPlaces);
      console.log(`Place with id ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  if (loading) {
    return <RunningShoesSpinner />;
  }

  return (
    <div>
      <Banner />
      <br />
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

      {data.features !== undefined &&
        isDropdownVisible &&
        filteredData.length > 0 && (
          <div className={styles.dropdown}>
            <div className={styles.listCheckbox}>
              {/* <h3>Done </h3>
                      <h3>Target</h3> */}
              <h3 className={styles.raceTypeSentence}>Race Type</h3>
            </div>
            {filteredData.map((d, index) => (
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
                  {d.properties.city}, {d.properties.state}
                </div>

                <div className={styles.marathonTypeDropdown}>
                  <Select
                    options={marathonTypeOptions}
                    isSearchable={false}
                    value={selectedMarathonType[index]}
                    onChange={(value) => handleMarathonType(index, value)}
                    onClick={(value) => handleMarathonType(index, value)}
                    placeholder="Select..."
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: "117px",
                      }),
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
        <div className={styles.confetti}>
          <ConfettiExplosion
            force={0.8}
            duration={5000}
            particleCount={500}
            width={2000}
            angle={180}
            gravity={0}
            zIndex={10000}
          />
        </div>
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
