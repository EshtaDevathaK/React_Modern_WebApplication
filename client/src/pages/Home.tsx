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
import { fetchWeatherData } from "@/lib/weatherService2";
import { getBackgroundColor } from "@/lib/weatherUtils";

// Get a greeting based on current time of day
function getGreetingByTime(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning in";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon in";
  } else {
    return "Good Evening in";
  }
}

export default function Home() {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchLocation, setSearchLocation] = useState("Los Angeles");
  const [apiKeyError, setApiKeyError] = useState(false);
  
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weatherData', searchLocation],
    queryFn: async () => {
      try {
        return await fetchWeatherData(searchLocation);
      } catch (err: any) {
        // Check if error is related to API key
        if (err?.message?.includes('API key')) {
          setApiKeyError(true);
        }
        throw err;
      }
    },
    enabled: !!searchLocation,
    retry: 1, // Only retry once on error
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
    if (weatherData) {
      const timer = setTimeout(() => {
        setShowToast(true);
        
        const hideTimer = setTimeout(() => {
          setShowToast(false);
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [weatherData]);

  // Show mood suggestion modal after delay
  useEffect(() => {
    if (weatherData) {
      const timer = setTimeout(() => {
        setShowMoodModal(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [weatherData]);

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    // Refetch with the new location
    setTimeout(() => refetch(), 100); // Small delay to ensure state update
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
        <div className="text-center max-w-md mx-auto p-6 rounded-lg shadow-lg bg-white">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-navy mb-2">Failed to load weather data</h2>
          
          {apiKeyError ? (
            <>
              <p className="text-gray-700 mb-4">
                OpenWeather API key is missing or invalid. Please ensure you have a valid API key configured.
              </p>
              <div className="text-sm text-gray-600 p-3 bg-gray-100 rounded mb-4">
                <p className="font-medium">Troubleshooting:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Check if your API key is correctly configured</li>
                  <li>Verify that your API key has weather data access permissions</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mt-2">
              Please check your internet connection and try again later.
            </p>
          )}
          
          <button 
            onClick={() => {
              setApiKeyError(false);
              refetch();
            }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto md:ml-0">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        {/* Greeting Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-heading text-navy">
            {getGreetingByTime()} 
            <span className="ml-2 text-primary">
              {weatherData?.location.name 
                ? `${weatherData.location.name}, ${weatherData.location.country}`
                : ''}
            </span>
          </h1>
          <p className="text-navy-light">
            Here's your daily weather and mood forecast. Enjoy!
          </p>
        </div>

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
