import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MultiDayForecast from "@/components/MultiDayForecast";
import HourlyForecast from "@/components/HourlyForecast";
import ChanceOfRain from "@/components/ChanceOfRain";
import { fetchWeatherData } from "@/lib/weatherService2";

export default function Forecast() {
  const [searchLocation, setSearchLocation] = useState("Los Angeles");
  
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weatherData', searchLocation],
    queryFn: () => fetchWeatherData(searchLocation),
    enabled: !!searchLocation,
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    setTimeout(() => refetch(), 100);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-light">
        <div className="text-center">
          <div className="text-4xl mb-4">🌤️</div>
          <p className="text-navy font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-light">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-navy font-medium">Failed to load weather data</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        <h1 className="text-2xl font-bold mb-6 font-heading">Detailed Forecast for {weatherData?.location.name}</h1>

        {/* Multi-day Forecast Section */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 font-heading">3-Day Forecast</h2>
          {weatherData && <MultiDayForecast weather={weatherData} />}
        </div>

        {/* Hourly Forecast Section */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 font-heading">24-Hour Forecast</h2>
          {weatherData && <HourlyForecast weather={weatherData} />}
        </div>

        {/* Precipitation Forecast */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 font-heading">Precipitation Forecast</h2>
          {weatherData && <ChanceOfRain weather={weatherData} />}
        </div>
      </main>
    </div>
  );
}