import axios from 'axios';
import { WeatherData, HistoricalData } from '../types/weather';

const API_KEY = 'c97c0c1086d42990e89d64d76f50bb61';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );
  return response.data;
};

export const getHistoricalWeather = async (lat: number, lon: number): Promise<HistoricalData> => {
  const response = await axios.get(
    `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&units=metric&appid=${API_KEY}`
  );
  return response.data;
};