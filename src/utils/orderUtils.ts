
import countries from '../data/countries.json';
import { CountryData, CityData } from '../types/order';

export const getRandomCountry = (): CountryData => {
  const countriesArr = countries as CountryData[];
  const randomIndex = Math.floor(Math.random() * countriesArr.length);
  return countriesArr[randomIndex];
};

export const getRandomCity = (country: CountryData): CityData => {
  if (country.cities.length === 0) {
    return {
      name: country.name + " City",
      latitude: country.latitude,
      longitude: country.longitude
    };
  }
  
  const randomIndex = Math.floor(Math.random() * country.cities.length);
  return country.cities[randomIndex];
};

export const getRandomColor = (): string => {
  const colors = [
    '#FF5722', // Deep Orange
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
    '#2196F3', // Blue
    '#03A9F4', // Light Blue
    '#00BCD4', // Cyan
    '#009688', // Teal
    '#4CAF50', // Green
    '#8BC34A', // Light Green
    '#FFC107'  // Amber
  ];
  
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
