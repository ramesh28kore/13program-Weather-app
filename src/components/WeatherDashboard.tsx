import React, { useState } from 'react';
import { Search, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format } from 'date-fns';
import { WeatherData, HistoricalData } from '../types/weather';
import { getWeather, getHistoricalWeather } from '../services/weatherService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeatherData(null);
    setHistoricalData(null);

    try {
      const weather = await getWeather(city);
      setWeatherData(weather);
      
      if (weather.coord) {
        const historical = await getHistoricalWeather(weather.coord.lat, weather.coord.lon);
        setHistoricalData(historical);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: historicalData?.hourly.slice(0, 24).map(item => 
      format(new Date(item.dt * 1000), 'HH:mm')
    ) || [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: historicalData?.hourly.slice(0, 24).map(item => item.temp) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Humidity (%)',
        data: historicalData?.hourly.slice(0, 24).map(item => item.humidity) || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Weather Dashboard</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              </div>
            </div>

            {historicalData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-4">24-Hour Forecast</h2>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}