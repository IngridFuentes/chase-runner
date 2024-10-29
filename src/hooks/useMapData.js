import { useState, useEffect } from "react";

const useMapData = () => {
    const [cityName, setCityName] = useState('');
    const [country, setCountry] = useState('');
    const [cityCoordinates, setCityCoordinates] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.106667, -94.676392]); // Default map center
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCityIndex, setSelectedCityIndex] = useState(-1);
    // const [filteredData, setFilteredData] = useState(null)
    const [data, setData] = useState({});

      const debounce = (func, delay) => {
        let timeoutId;
        return function() {
          const context = this;
          const args = arguments;
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(context, args), delay);
          console.log(timeoutId, 'time')
        };
      };
   
      const handleCitySearch = async (cityName) => {
        try{
          const response = await fetch(
                  `https://api.geoapify.com/v1/geocode/search?text=${cityName}&lang=en&limit=10&type=city&apiKey=63f9e025a41e4c2eb7b9fea7f557a9b5`
                );
          const data = await response.json();
          setData(data);
          return data;
        } 
        catch (error) {
          console.error(error);
          throw error;
        }
    
      }
      useEffect(() => {
        if(cityName.trim().length >=3) {
          const debouncedSearch = debounce(handleCitySearch, 1000);
          debouncedSearch(cityName);
        }
      }, [cityName])

    const extractCityInfo = (cityData) => {
      console.log(cityData, 'city')
      return cityData.map(({ properties }) => {
        const { lat, lon, country, name: cityName } = properties;
        return {
          lat,
          lon,
          country,
          cityName,
        };
      });
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleCitySearch(cityName);
    };

    const handleSuggestionClick = async (selectedCity) => {
        setCityName(selectedCity);
        setSelectedCity(selectedCity);
        setSuggestions([]);
    }

        //Fetch saved places from the backend
    const fetchSavedPlaces = async () => {
          try {
              const response = await fetch('http://localhost:3000/geojson');
              if(response.ok) {
                const data = await response.json();
                setSavedPlaces(data);
                console.log(data, 'hi');
              } else{
                throw new Error('Network response was not ok.');
              }
            // const data = await response.json();
            // console.log(data, 'backend data')
            // setSavedPlaces(data);
          } catch (error) {
            console.error(error);
          }
        };
    useEffect(() => {
        fetchSavedPlaces();
      }, []);


      async function saveGeoJsonData(geojson) {
        try {
            const response = await fetch('http://localhost:3000/geojson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'My GeoJSON',
                    description: 'Description of the GeoJSON',
                    geojson,
                }),
            });
            const data = await response.json();
            console.log('GeoJSON data saved:', data);
        } catch (error) {
            console.error('Error saving GeoJSON data:', error);
        }
    }
    
    // Fetch GeoJSON data
    async function fetchGeoJsonData() {
        try {
            const response = await fetch('http://localhost:3000/geojson');
            const data = await response.json();
            console.log('GeoJSON data fetched:', data);
            return data;
        } catch (error) {
            console.error('Error fetching GeoJSON data:', error);
        }
    }

      return{
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
        handleCitySearch,
        data,
        setData,
        handleSubmit,
        suggestions,
        handleSuggestionClick,
        // handleKeyDown,
        // selectedCityIndex,
        // saveCityToBackend
        // fetchCitiesFromAPI,
        fetchSavedPlaces,
        saveGeoJsonData,
        fetchGeoJsonData,
      }

}

export default useMapData;