import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth0 } from '@auth0/auth0-react';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const useMapData = () => {
    const [cityName, setCityName] = useState('');
    const [country, setCountry] = useState('');
    const [cityCoordinates, setCityCoordinates] = useState(null);
    const [mapCenter, setMapCenter] = useState([39.106667, -94.676392]);
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [data, setData] = useState({});

    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    // const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const geoapifyUrl = 'https://api.geoapify.com/v1/geocode/search'
    const backendUrl = 'http://localhost:3000'
    // const backendUrl = 'https://chase-runner-backend.vercel.app'

  useEffect(() => {
    // This will be called when user is authenticated
    if (isAuthenticated) {
      // console.log("User authenticated:", user);
    }
  }, [isAuthenticated, user]);
   
      const handleCitySearch = useCallback(async (cityName) => {
        try{
          const response = await fetch(
                  `${geoapifyUrl}?text=${cityName}&lang=en&limit=10&type=city&filter=countrycode:us&apiKey=63f9e025a41e4c2eb7b9fea7f557a9b5`
                );
          const data = await response.json();
          console.log(data, 'data API')
          setData(data);
          return data;
        } 
        catch (error) {
          console.error(error);
          throw error;
        }
    
      }, []);

      const debouncedSearch = useMemo(
        () => debounce(async (cityName) => {
          const newData = await handleCitySearch(cityName);
          setData(newData);
        }, 300),
        [handleCitySearch]
      );
    
      useEffect(() => {
        if (cityName.trim().length >= 3) {
          // Call the debounced function to handle the search
          debouncedSearch(cityName);
        }
      }, [cityName, debouncedSearch]); 

    const handleSuggestionClick = useCallback(async (selectedCity) => {
        setCityName(selectedCity);
        setSelectedCity(selectedCity);
        setSuggestions([]);
    }, []);

        //Fetch saved places from the backend
        const fetchSavedPlaces = useCallback(async () => {
          try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${backendUrl}/user/id/runs`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
        
            if (response.ok) {
              const data = await response.json();
              // console.log(data, 'data');
              const filteredData = data.filter(item => item.user_id === user.sub);
              // console.log(filteredData, 'data that belongs to user')
              setSavedPlaces(filteredData);
            } else {
              console.error('Failed to fetch runs');
            }
          } catch (error) {
            console.error('Error fetching runs:', error);
          }
        }, [getAccessTokenSilently, user?.sub]);
        
        useEffect(() => {
          if (isAuthenticated) {
            fetchSavedPlaces();
          }
        }, [fetchSavedPlaces, isAuthenticated]);


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
        suggestions,
        handleSuggestionClick,
        fetchSavedPlaces,
      }

}

export default useMapData;