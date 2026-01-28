import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [cityFilter, setCityFilter] = useState('');
  const reduxSelectedCity = useSelector(state => state.city?.selectedCity);

  // Sync Redux selectedCity to local state
  useEffect(() => {
    if (reduxSelectedCity) {
      setSelectedCity(reduxSelectedCity);
      // Use city name as filter
      setCityFilter(reduxSelectedCity.name);
    }
  }, [reduxSelectedCity]);

  const selectCity = (city) => {
    setSelectedCity(city);
    setCityFilter(city.name || city);
  };

  const clearCityFilter = () => {
    setSelectedCity(null);
    setCityFilter('');
  };

  const value = {
    selectedCity,
    cityFilter,
    selectCity,
    clearCityFilter,
  };

  return (
    <CityContext.Provider value={value}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within CityProvider');
  }
  return context;
};

export default CityContext;
