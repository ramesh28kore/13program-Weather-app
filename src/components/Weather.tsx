import React, { useState } from 'react';
import { Search, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getWeather } from '../services/weatherService';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const data = await getWeather(city);
      setWeatherData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Weather Forecast</h1>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && (
            <p className="mt-2 text-red-600">{error}</p>
          )}
        </div>

        {weatherData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Current Weather in {weatherData.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span className="text-lg">
                  {weatherData.main.temp.toFixed(1)}°C
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-500" />
                <span className="text-lg capitalize">
                  {weatherData.weather[0].description}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-gray-500" />
                <span className="text-lg">
                  {weatherData.wind.speed} m/s
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span className="text-lg">
                  {weatherData.main.humidity}%
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">
                  Feels like: {weatherData.main.feels_like.toFixed(1)}°C
                </p>
                <p className="text-gray-600">
                  Pressure: {weatherData.main.pressure} hPa
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;