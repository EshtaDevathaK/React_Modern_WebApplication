import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWeatherData } from "@/lib/weatherService";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { getTemperatureColor } from "@/lib/weatherUtils";
import { Plus, X, ChevronRight, Star, StarOff, MapPin, Trash2, Heart } from "lucide-react";

export default function Locations() {
  const [searchLocation, setSearchLocation] = useState("");
  const [savedLocations, setSavedLocations] = useState([
    "Los Angeles",
    "New York",
    "London",
    "Tokyo",
    "Sydney"
  ]);
  const [favoriteLocations, setFavoriteLocations] = useState([
    "Los Angeles",
    "Tokyo"
  ]);
  const [activeLocation, setActiveLocation] = useState("Los Angeles");

  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weatherData', activeLocation],
    queryFn: () => fetchWeatherData(activeLocation),
    enabled: !!activeLocation,
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
  };

  const handleAddLocation = () => {
    if (searchLocation && !savedLocations.includes(searchLocation)) {
      setSavedLocations([...savedLocations, searchLocation]);
      setSearchLocation("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    setSavedLocations(savedLocations.filter(loc => loc !== location));
    if (favoriteLocations.includes(location)) {
      setFavoriteLocations(favoriteLocations.filter(loc => loc !== location));
    }
  };

  const handleToggleFavorite = (location: string) => {
    if (favoriteLocations.includes(location)) {
      setFavoriteLocations(favoriteLocations.filter(loc => loc !== location));
    } else {
      setFavoriteLocations([...favoriteLocations, location]);
    }
  };

  const handleSelectLocation = (location: string) => {
    setActiveLocation(location);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        <h1 className="text-2xl font-bold mb-6 font-heading flex items-center">
          <MapPin className="mr-2 h-6 w-6" />
          Saved Locations
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Locations List */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold font-heading">My Locations</h2>
                <div className="h-8 w-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                  {savedLocations.length}
                </div>
              </div>

              {/* Add Location Input */}
              <div className="flex items-center space-x-2 mb-6">
                <Input 
                  placeholder="Add new location" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddLocation();
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={handleAddLocation}
                  disabled={!searchLocation || savedLocations.includes(searchLocation)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Location List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {savedLocations.map((location) => (
                  <div 
                    key={location}
                    className={`
                      flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                      ${activeLocation === location ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex items-center">
                      {favoriteLocations.includes(location) && (
                        <Star className={`h-4 w-4 mr-2 ${activeLocation === location ? 'text-yellow-200' : 'text-yellow-500'}`} />
                      )}
                      <span className="font-medium">{location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        className={`p-1 rounded-full ${activeLocation === location ? 'hover:bg-primary-dark' : 'hover:bg-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(location);
                        }}
                      >
                        {favoriteLocations.includes(location) ? (
                          <StarOff className={`h-4 w-4 ${activeLocation === location ? 'text-white' : 'text-gray-600'}`} />
                        ) : (
                          <Star className={`h-4 w-4 ${activeLocation === location ? 'text-white' : 'text-gray-600'}`} />
                        )}
                      </button>
                      <button 
                        className={`p-1 rounded-full ${activeLocation === location ? 'hover:bg-primary-dark' : 'hover:bg-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLocation(location);
                        }}
                      >
                        <Trash2 className={`h-4 w-4 ${activeLocation === location ? 'text-white' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Favorite Locations */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold font-heading mb-4 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Favorite Locations
              </h2>
              
              {favoriteLocations.length > 0 ? (
                <div className="space-y-2">
                  {favoriteLocations.map((location) => (
                    <div 
                      key={location}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <span className="font-medium">{location}</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No favorite locations yet</p>
                  <p className="text-sm mt-1">Star a location to add it here</p>
                </div>
              )}
            </Card>
          </div>

          {/* Weather Details */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Card className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌤️</div>
                  <p className="text-navy font-medium">Loading weather data...</p>
                </div>
              </Card>
            ) : error ? (
              <Card className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-navy font-medium">Failed to load weather data</p>
                  <p className="text-gray-600 mt-2">Please try again later</p>
                </div>
              </Card>
            ) : weatherData ? (
              <>
                {/* Current Weather Card */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold font-heading">
                      {weatherData.location.name}, {weatherData.location.country}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleToggleFavorite(activeLocation)}
                    >
                      {favoriteLocations.includes(activeLocation) ? (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="mr-4">
                        {getWeatherIcon(weatherData.current.condition.text, "w-24 h-24")}
                      </div>
                      <div>
                        <p className="text-4xl font-bold" style={{ color: getTemperatureColor(weatherData.current.temp_c) }}>
                          {Math.round(weatherData.current.temp_c)}°C
                        </p>
                        <p className="text-gray-600 text-lg">
                          {weatherData.current.condition.text}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Feels like:</span>
                        <span className="font-medium">{Math.round(weatherData.current.feelslike_c)}°C</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Wind:</span>
                        <span className="font-medium">{weatherData.current.wind_kph} km/h</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Humidity:</span>
                        <span className="font-medium">{weatherData.current.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">UV Index:</span>
                        <span className="font-medium">{weatherData.current.uv}</span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Forecast Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold font-heading mb-4">
                    3-Day Forecast
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {weatherData.forecast.forecastday.map((day: any) => (
                      <div key={day.date} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium mb-2">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <div className="flex items-center mb-2">
                          {getWeatherIcon(day.day.condition.text, "w-10 h-10")}
                          <p className="ml-2">{day.day.condition.text}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">High: {Math.round(day.day.maxtemp_c)}°C</span>
                          <span className="text-gray-600">Low: {Math.round(day.day.mintemp_c)}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Location Details */}
                <Card className="p-6 mt-6">
                  <h2 className="text-xl font-semibold font-heading mb-4">
                    Location Details
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Local Time</p>
                      <p className="font-medium">{weatherData.location.localtime}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Coordinates</p>
                      <p className="font-medium">{weatherData.location.lat}, {weatherData.location.lon}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Timezone</p>
                      <p className="font-medium">{weatherData.location.tz_id}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Region</p>
                      <p className="font-medium">{weatherData.location.region || 'N/A'}</p>
                    </div>
                  </div>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}