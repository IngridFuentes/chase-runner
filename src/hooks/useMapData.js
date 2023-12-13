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

console.log(data, 'data 2')

    // const handleCitySearch = async (cityName) => {
    //   try {
    //   //   if (cityName.trim() === '') {
    //   //     throw new Error('Text value cannot be empty!');
    //   //   }
    //     const response = await fetch(
    //       `https://api.geoapify.com/v1/geocode/search?text=${cityName}&lang=en&limit=10&type=city&apiKey=63f9e025a41e4c2eb7b9fea7f557a9b5`
    //     );
    //     const data = await response.json();
    //     console.log(data, 'data 1')
    //     const filteredData = data.features
    //     .map((d, i) => (
    //       <li key={i}>
    //         {d.properties.name !== undefined && d.properties.name !== "" ? d.properties.name : d.properties.city}, {d.properties.state}, {d.properties.country}
    //       </li>
    //     ));
        
    //     const latLonCountryArray = extractCityInfo(data.features);
    
    //     await Promise.all(
    //       latLonCountryArray.map(async ({ lat, lon, country, cityName }) => {
    //         try {
    //           const res = await fetch('http://localhost:3000/api/places', {
    //             method: 'POST',
    //             headers: {
    //               'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ lat, lon, name: cityName, country }),
    //           });
    
    //           if (!res.ok) {
    //             throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
    //           }
    //         } catch (error) {
    //           console.error('Error in fetch:', error);
    //           // Handle the error as needed
    //         }
    //       })
    //     );
    
    //     setCityName('');
    //     setFilteredData(filteredData);
    //     // setShowConfetti(true);
    
    //     setTimeout(() => {
    //       setShowConfetti(false);
    //       fetchSavedPlaces();
    //     }, 2000);
    //     return filteredData.length > 0 ? filteredData : [<li key={0}>No matching cities</li>];
    //   } catch (error) {
    //     console.error(error);
    //     throw error;
    //   }
    // };
    // useEffect(() => {
    //   handleCitySearch();
    // }, [cityName]);


    
  //   const saveCityToBackend = async (cityData) => {
  //     const { lat, lon, country, cityName } = extractCityInfo(selectedCity);

  // try {
  //   const res = await fetch('http://localhost:3000/api/places', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ lat, lon, name: cityName, country }),
  //   });

  //   if (!res.ok) {
  //     throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  //   }
  // } catch (error) {
  //   console.error('Error in saveCityToBackend:', error);
  //   // Handle the error as needed
  // }
  //   };
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

    // const handleSuggestionClick = (city) => {
    //   setSelectedCity(city);
    //   setCityName(''); // Clear the cityName to reset the search input
    //   setSuggestions([]); // Clear the suggestions
    //   // saveCityToBackend(city);
    // };
  
        // try {
        //   const response = await fetch(
        //     `https://api.geoapify.com/v1/geocode/search?text=${cityName}&lang=en&limit=10&type=city&apiKey=63f9e025a41e4c2eb7b9fea7f557a9b5`
        //   );
        //   const data = await response.json();
        //   const filteredData = data.features.filter((d) => d.properties.name !== undefined)
        //                     .map((d, i) =>
        //                     // console.log(d.properties)
        //                         <li key={i}>
        //                            {d.properties.name}, 
        //                             {d.properties.country}
        //                         </li>
        //                     );
        //   const latLonCountryArray = data.features.map((d, i) => ({
        //                       lat: d.properties.lat,
        //                       lon: d.properties.lon,
        //                       country: d.properties.country,
        //                       cityName: d.properties.name
        //                     }));

        //   await Promise.all(
        //                       latLonCountryArray.map(async ({ lat, lon, country, cityName }) => {
        //                         console.log('Lat:', lat, 'Lon:', lon, 'Country:', country, 'name:', cityName);
                        
        //                         // Use try-catch to handle errors in each fetch separately
        //                         try {
        //                           const res = await fetch('http://localhost:3000/api/places', {
        //                             method: 'POST',
        //                             headers: {
        //                               'Content-Type': 'application/json',
        //                             },
        //                             body: JSON.stringify({ lat, lon, name: cityName, country }),
        //                           });
                        
        //                           if (!res.ok) {
        //                             throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
        //                           }
        //                         } catch (error) {
        //                           console.error('Error in fetch:', error);
        //                           // Handle the error as needed
        //                         }
        //                       })
        //                     );
        //                     setCityName('');
        //                     setShowConfetti(true);
                        
        //                     setTimeout(() => {
        //                       setShowConfetti(false);
        //                       fetchSavedPlaces();
        //                     }, 2000);
                        
        //                     return filteredData.length > 0 ? filteredData : <li>No matching cities</li>;
        //                   } catch (error) {
        //                     console.error(error);
        //                     throw error;
        //                   }
        //                 };


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
              const response = await fetch('http://localhost:3000/api/places');
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

  //   useEffect(()=> {
  //     const search = async () => {
  //       try {
  //         const result = await handleCitySearch(cityName);
  //         setSuggestions(result);
  //         // setSuggestions([]);
  //       } catch (error) {
  //         console.error('Error:', error.message);
  //       }
  //     };
  //     const timeoutId = setTimeout(() => {
  //       search();
  //     }, 300);
  //     return () => clearTimeout(timeoutId);
  // }, [cityName]);

 

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
        showConfetti,
        handleCitySearch,
        data,
        handleSubmit,
        suggestions,
        handleSuggestionClick,
        // handleKeyDown,
        // selectedCityIndex,
        // saveCityToBackend
        // fetchCitiesFromAPI,
        // fetchSavedPlaces,
      }

}

export default useMapData;