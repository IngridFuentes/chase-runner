import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from '@auth0/auth0-react';

const useMapData = () => {
    const [cityName, setCityName] = useState('');
    const [country, setCountry] = useState('');
    const [cityCoordinates, setCityCoordinates] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.106667, -94.676392]); // Default map center
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [data, setData] = useState({});

    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    // const backendUrl = process.env.REACT_APP_BACKEND_URL;
    // const backendUrl = 'http://localhost:3000'
    const backendUrl = 'https://chase-runner-backend.vercel.app'

  useEffect(() => {
    // This will be called when user is authenticated
    if (isAuthenticated) {
      console.log("User authenticated:", user);
    }
  }, [isAuthenticated, user]);

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
        const fetchSavedPlaces = useCallback(async () => {
          console.log(isAuthenticated, "fetch places authenticated?");
          console.log('User authenticated:', user?.sub);
        
          try {
            const token = await getAccessTokenSilently();
            // console.log(token, 'token fetch');
            const response = await fetch(`${backendUrl}/user/id/runs`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
        
            if (response.ok) {
              const data = await response.json();
              console.log(data, 'data');
              const filteredData = data.filter(item => item.user_id === user.sub);
              console.log(filteredData, 'data that belongs to user')
              setSavedPlaces(filteredData);
            } else {
              console.error('Failed to fetch runs');
            }
          } catch (error) {
            console.error('Error fetching runs:', error);
          }
        }, [getAccessTokenSilently, isAuthenticated, user?.sub]);
        
        useEffect(() => {
          if (isAuthenticated) {
            fetchSavedPlaces();
          }
        }, [fetchSavedPlaces, isAuthenticated]);

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