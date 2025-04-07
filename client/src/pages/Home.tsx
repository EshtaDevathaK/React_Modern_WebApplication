import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CurrentWeather from "@/components/CurrentWeather";
import ChanceOfRain from "@/components/ChanceOfRain";
import TodaysHighlights from "@/components/TodaysHighlights";
import HourlyForecast from "@/components/HourlyForecast";
import MultiDayForecast from "@/components/MultiDayForecast";
import OutfitOfTheDay from "@/components/OutfitOfTheDay";
import MusicVibes from "@/components/MusicVibes";
import LocalVibeCard from "@/components/LocalVibeCard";
import MoodModal from "@/components/MoodModal";
import MoodToast from "@/components/MoodToast";
import { fetchWeatherData } from "@/lib/weatherService";
import { getBackgroundColor } from "@/lib/weatherUtils";

export default function Home() {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  
  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weatherData', 'Los Angeles'],
    queryFn: () => fetchWeatherData('Los Angeles'),
  });

  // Set dynamic background based on weather condition
  useEffect(() => {
    if (weatherData) {
      const weatherCondition = weatherData.current.condition.text.toLowerCase();
      document.body.className = getBackgroundColor(weatherCondition);
    }
  }, [weatherData]);

  // Show toast on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
      
      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show mood suggestion modal after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMoodModal(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    // This would trigger a new query with the updated location
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

        {/* Current Weather & Chance of Rain */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {weatherData && <CurrentWeather weather={weatherData} />}
          </div>
          <div>
            {weatherData && <ChanceOfRain weather={weatherData} />}
          </div>
        </div>

        {/* Today's Highlights */}
        {weatherData && <TodaysHighlights weather={weatherData} />}

        {/* Hourly Forecast Chart */}
        {weatherData && <HourlyForecast weather={weatherData} />}

        {/* 3-Day Forecast & Outfit of the Day */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
          <div className="lg:col-span-4">
            {weatherData && <MultiDayForecast weather={weatherData} />}
          </div>
          <div className="lg:col-span-3">
            {weatherData && <OutfitOfTheDay weather={weatherData} />}
          </div>
        </div>

        {/* Music Vibes & Local Vibe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {weatherData && <MusicVibes weather={weatherData} />}
          {weatherData && <LocalVibeCard weather={weatherData} />}
        </div>
      </main>

      {/* Mood Toast Notification */}
      <MoodToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        weather={weatherData}
      />

      {/* Mood Suggestion Modal */}
      <MoodModal 
        isOpen={showMoodModal} 
        onClose={() => setShowMoodModal(false)} 
        weather={weatherData}
      />
    </div>
  );
}
